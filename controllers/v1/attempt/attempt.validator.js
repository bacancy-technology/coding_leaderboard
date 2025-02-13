const {
  validateUpdateAttempt,
} = require('./validatorsDefinitions');

const { genericValidator } = require('../../../helpers/helpers');

exports.updateAttemptValidator = genericValidator(validateUpdateAttempt.allowedParams, validateUpdateAttempt.requiredParams);
