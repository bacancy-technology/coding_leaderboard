const express = require('express');

const router = express.Router();

const attemptController = require('./attempt.controller');
const attemptValidator = require('./attempt.validator');

const { authentication, authorization } = require('../../../middleware/middleware');

router.get('', authentication, authorization, attemptController.getAll);
router.post('', attemptValidator.updateAttemptValidator, authentication, authorization, attemptController.create);

module.exports = router;
