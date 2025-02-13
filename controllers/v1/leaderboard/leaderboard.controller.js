const {
  successResponse,
} = require('../../../helpers/helpers');
const { successMessages } = require('../../../helpers/messages');
const { LeaderboardsModel } = require('../../../models/leaderboard');

exports.getAll = async (req, res) => {
  const data = await LeaderboardsModel.find({}).sort({ score: -1 }).populate('usersId').lean();
  return successResponse('leaderboards', res, data, successMessages.DATA_FETCHED);
};

exports.getMyScore = async (req, res) => {
  const data = await LeaderboardsModel.find({ usersId: req.user._id }).sort({ score: -1 }).populate('usersId').lean();
  return successResponse('leaderboards', res, data, successMessages.DATA_FETCHED);
};
