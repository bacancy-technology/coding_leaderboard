const attempts = require('./attempts');
const leaderboards = require('./leaderboards');
const questions = require('./questions');

module.exports = {
  paths: {
    ...questions.paths,
    ...attempts.paths,
    ...leaderboards.paths,
  },
};
