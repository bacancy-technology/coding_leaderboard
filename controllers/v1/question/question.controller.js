const {
  successResponse,
  errorResponse,
} = require('../../../helpers/helpers');
const { successMessages, errorMessages } = require('../../../helpers/messages');
const { AttemptsModel } = require('../../../models/attempts');
const { QuestionsModel } = require('../../../models/questions');

exports.create = async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };
    const question = await new QuestionsModel({
      title: param.title,
      platform: param.platform,
      difficulty: param.difficulty,
      points: param.points,
      visible: param.visible,
      postedBy: req.user._id,
      link: param.link,
    }).save();
    return successResponse('questions', res, [{ _id: question._id }], successMessages.DATA_UPDATED);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };
    const query = {};

    if (param.title) {
      query.title = { $regex: param.title, $options: 'i' };
    }
    if (param.platform) {
      query.platform = param.platform;
    }
    if (param.difficulty) {
      query.difficulty = param.difficulty;
    }
    if (param.questionsId) {
      query.questionsId = param.questionsId;
    }

    let data = await QuestionsModel.find(query).sort({ updatedAt: -1 }).lean();

    // If status filter is applied, fetch attempts and filter questions accordingly
    if (param.status) {
      const STATUS = ['Doing', 'Done'];
      const options = {
        usersId: req.user._id,
        status: param.status,
      };

      if (!STATUS.includes(param.status)) {
        const attempts = await AttemptsModel.find({ usersId: req.user._id }).populate('questionsId').lean();
        const questionIds = attempts.map((attempt) => attempt.questionsId._id);
        data = data.filter((question) => !questionIds.some((id) => id.equals(question._id)));
      } else {
        const attempts = await AttemptsModel.find(options).populate('questionsId').lean();
        data = attempts.map((attempt) => attempt.questionsId);
      }
    }

    return successResponse('questions', res, data, successMessages.DATA_FETCHED);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.findById = async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };
    const data = await QuestionsModel.findOne({ _id: param.questionsId }).lean();
    if (data) {
      return successResponse('questions', res, [data], successMessages.DATA_FETCHED);
    }
    return errorResponse(req, res, errorMessages.INVALID_USER_ID, 400);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.findByIdAndUpdate = async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };
    const data = await QuestionsModel.findOneAndUpdate({ _id: param.questionsId }, {
      title: param.title,
      platform: param.platform,
      difficulty: param.difficulty,
      points: param.points,
      visible: param.visible,
      postedBy: req.user._id,
      link: param.link,
    }, {
      new: true,
    }).lean();
    if (data) {
      return successResponse('questions', res, [data], successMessages.DATA_FETCHED);
    }
    return errorResponse(req, res, errorMessages.INVALID_USER_ID, 400);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.deleteById = async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };
    const deletedUserDetails = await QuestionsModel.findOne({ _id: param.questionsId }).lean();
    await QuestionsModel.findByIdAndDelete(param.questionsId);
    if (deletedUserDetails) {
      return successResponse('questions', res, [deletedUserDetails], successMessages.DATA_DELETED);
    }
    return errorResponse(req, res, errorMessages.INVALID_USER_ID, 400);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
