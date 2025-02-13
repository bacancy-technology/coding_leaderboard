exports.validateCreateQuestion = {
  allowedParams: ['title', 'platform', 'difficulty', 'points', 'visible', 'link'],
  get requiredParams() {
    return this.allowedParams;
  },
};

exports.validateQuestionsId = {
  allowedParams: ['questionsId'],
  get requiredParams() {
    return this.allowedParams;
  },
};

exports.validateUpdateQuestion = {
  allowedParams: ['questionsId', 'title', 'platform', 'difficulty', 'points', 'visible', 'link'],
  get requiredParams() {
    return this.allowedParams;
  },
};
