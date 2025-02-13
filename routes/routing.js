const cors = require('cors');
const rateLimit = require('express-rate-limit');
const attemptRoutes = require('../controllers/v1/attempt/attempt.routes');
const leaderboardRoutes = require('../controllers/v1/leaderboard/leaderboard.routes');
const questionRoutes = require('../controllers/v1/question/question.routes');

const { envConstants } = require('../helpers/constants');
const { errorMessages } = require('../helpers/messages');

const whitelist = [`${envConstants.APP_HOST}:${envConstants.APP_PORT}`, 'http://localhost', envConstants.APP_HOST, `https://${envConstants.APP_HOST}`];

const perIpTimeLimit = 15 * 60 * 1000; // 15 minutes

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(errorMessages.CORS_BLOCK));
    }
  },
};

const { errorHandler } = require('../middleware/errorHandler');

const apiLimiter = rateLimit({
  windowMs: perIpTimeLimit,
  max: 1000,
  message: {
    error: errorMessages.TOO_MANY_REQUESTS,
  },
});

const routes = (app) => {
  app.use('/api/v1/questions', cors(corsOptions), apiLimiter, questionRoutes);
  app.use('/api/v1/attempts', cors(corsOptions), apiLimiter, attemptRoutes);
  app.use('/api/v1/leaderboards', cors(corsOptions), apiLimiter, leaderboardRoutes);

  app.use(errorHandler);
};

module.exports = { routes };
