const { attemptsApiDocumentation } = require('../../controllers/v1/attempt/attempts.api.documentation');

module.exports = {
  paths: {
    ...attemptsApiDocumentation,
  },
};
