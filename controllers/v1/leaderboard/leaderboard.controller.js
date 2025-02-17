const {
  successResponse,
  errorResponse,
} = require('../../../helpers/helpers');
const { successMessages } = require('../../../helpers/messages');
const { LeaderboardsModel } = require('../../../models/leaderboard');

exports.getAll = async (req, res) => {
  const { search } = req.query;

  try {
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'usersId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $match: search ? {
          'userDetails.name': { $regex: search, $options: 'i' },
        } : {},
      },
      {
        $sort: { score: -1 },
      },
      {
        $addFields: {
          usersId: '$userDetails', // Maintain the same response structure
        },
      },
      {
        $project: {
          userDetails: 0, // Remove the temporary lookup field
        },
      },
    ];

    const data = await LeaderboardsModel.aggregate(pipeline);
    return successResponse('leaderboards', res, data, successMessages.DATA_FETCHED);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.getMyScore = async (req, res) => {
  const data = await LeaderboardsModel.find({ usersId: req.user._id }).sort({ score: -1 }).populate('usersId').lean();
  return successResponse('leaderboards', res, data, successMessages.DATA_FETCHED);
};
