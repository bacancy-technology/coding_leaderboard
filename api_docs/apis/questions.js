const { questionsApiDocumentation } = require('../../controllers/v1/question/questions.api.documentation');

module.exports = {
  paths: {
    ...questionsApiDocumentation,
  },
};
