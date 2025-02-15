const Bluebird = require('bluebird');
const { errorMessages, successMessages } = require('./messages');

exports.successResponse = async (type, res, data, message = successMessages.OPERATION_COMPLETED, code = 200) => {
  res.status(code);
  const structuredResponse = [];
  await Bluebird.each(data, (item) => {
    const { _id, ...attributes } = item;
    structuredResponse.push({
      id: _id,
      type,
      attributes: {
        ...attributes,
      },
    });
  });

  res.send({
    code,
    success: true,
    message,
    data: structuredResponse,
  });
};

exports.errorResponse = (req, res, message = errorMessages.SOMETHING_WENT_WRONG, code = 500, data = null) => {
  res.status(code);
  res.send({
    code,
    success: false,
    message,
    data,
  });
};

exports.genericValidator = (allowedParams, requiredParams) => (req, res, next) => {
  const param = { ...req.body, ...req.params, ...req.query };

  let failed = false;
  const invalidRequiredParams = [];
  const invalidAllowedParams = [];

  Object.keys(param).forEach((element) => {
    if (!allowedParams.includes(element)) {
      failed = true;
      invalidAllowedParams.push(element);
    }
  });

  requiredParams.forEach((element) => {
    if (!Object.prototype.hasOwnProperty.call(param, element)) {
      failed = true;
      invalidRequiredParams.push(element);
    }
  });

  const invalidString = {
    'Required parameters that are not provided': invalidRequiredParams,
    'Not allowed parameters that are provided': invalidAllowedParams,
  };

  if (failed) return exports.errorResponse(req, res, errorMessages.INVALID_PARAMS, 400, invalidString);
  return next();
};
