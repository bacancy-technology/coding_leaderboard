exports.validateUpdateAttempt = {
  allowedParams: ['questionsId', 'status'],
  get requiredParams() {
    return this.allowedParams;
  },
};
