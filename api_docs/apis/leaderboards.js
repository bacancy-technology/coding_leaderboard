const { leaderboardsApiDocumentation } = require('../../controllers/v1/leaderboard/leaderboards.api.documentation');

module.exports = {
  paths: {
    ...leaderboardsApiDocumentation,
  },
};
