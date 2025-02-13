const {
  successResponse,
  errorResponse,
} = require('../../../helpers/helpers');
const { successMessages } = require('../../../helpers/messages');
const { AttemptsModel } = require('../../../models/attempts');
const { LeaderboardsModel } = require('../../../models/leaderboard');
const { QuestionsModel } = require('../../../models/questions');

exports.create = async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };

    const ifAlreadyDone = await AttemptsModel.exists({ usersId: req.user._id, questionsId: param.questionsId, status: 'Done' });

    if (ifAlreadyDone) {
      return successResponse('attempts', res, [], successMessages.DATA_UPDATED);
    }

    const attempt = await AttemptsModel.findOneAndUpdate({ usersId: req.user._id, questionsId: param.questionsId }, {
      usersId: req.user._id,
      questionsId: param.questionsId,
      status: param.status,
    }, {
      new: true,
      upsert: true,
    }).lean();

    if (param.status === 'Done') {
      const question = await QuestionsModel.findOne({ _id: param.questionsId }).lean();
      const currentScore = await LeaderboardsModel.findOne({ usersId: req.user._id }).lean();
      let score = 0;
      if (!currentScore) {
        score = question.points;
      } else {
        score = currentScore.score + question.points;
      }
      await LeaderboardsModel.findOneAndUpdate({ usersId: req.user._id }, {
        usersId: req.user._id,
        score,
      }, {
        new: true,
        upsert: true,
      }).lean();
    }

    return successResponse('attempts', res, [{ _id: attempt._id }], successMessages.DATA_UPDATED);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.getAll = async (req, res) => {
  const param = { ...req.body, ...req.params, ...req.query };
  const query = { usersId: req.user._id }; // Default filter by logged in user

  if (param.usersId) {
    query.usersId = param.usersId;
  }
  if (param.questionsId) {
    query.questionsId = param.questionsId;
  }
  if (param.status) {
    query.status = param.status;
  }

  const data = await AttemptsModel.find(query)
    .sort({ updatedAt: -1 })
    .populate('questionsId')
    .populate('usersId')
    .lean();

  return successResponse('attempts', res, data, successMessages.DATA_FETCHED);
};
