const mongoose = require('mongoose');

const Leaderboards = new mongoose.Schema({
  usersId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = { LeaderboardsModel: mongoose.model('leaderboards', Leaderboards) };
