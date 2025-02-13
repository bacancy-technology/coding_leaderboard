const {
  validateCreateQuestion,
  validateQuestionsId,
  validateUpdateQuestion,
} = require('./validatorsDefinitions');

const { genericValidator } = require('../../../helpers/helpers');

exports.createQuestionValidator = genericValidator(validateCreateQuestion.allowedParams, validateCreateQuestion.requiredParams);
exports.questionsIdValidator = genericValidator(validateQuestionsId.allowedParams, validateQuestionsId.requiredParams);
exports.updateQuestionValidator = genericValidator(validateUpdateQuestion.allowedParams, validateUpdateQuestion.requiredParams);
