const mongoose = require('mongoose');

const Questions = new mongoose.Schema({
  title: { type: String, required: true },
  platform: {
    type: String,
    enum: ['LeetCode', 'HackerRank', 'HackerEarth'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  points: { type: Number, default: 0 }, // Easy: 1, Medium: 2, Hard: 3
  visible: { type: Boolean, default: true },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  link: { type: String },
}, {
  timestamps: true,
});

module.exports = { QuestionsModel: mongoose.model('questions', Questions) };
