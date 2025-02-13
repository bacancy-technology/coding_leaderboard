const mongoose = require('mongoose');

const Attempts = new mongoose.Schema({
  usersId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  questionsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'questions',
    required: true,
  },
  status: {
    type: String,
    enum: ['Doing', 'Done'],
    default: 'Doing',
  },
}, {
  timestamps: true,
});

module.exports = { AttemptsModel: mongoose.model('attempts', Attempts) };
