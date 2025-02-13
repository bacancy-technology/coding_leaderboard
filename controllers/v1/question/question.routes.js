const express = require('express');

const router = express.Router();

const questionController = require('./question.controller');
const questionValidator = require('./question.validator');

const { authentication, authorization } = require('../../../middleware/middleware');

router.get('', authentication, authorization, questionController.getAll);
router.post('', questionValidator.createQuestionValidator, authentication, authorization, questionController.create);
router.get('/:questionsId', questionValidator.questionsIdValidator, authentication, authorization, questionController.findById);
router.put('/:questionsId', questionValidator.updateQuestionValidator, authentication, authorization, questionController.findByIdAndUpdate);
router.delete('/:questionsId', questionValidator.questionsIdValidator, authentication, authorization, questionController.deleteById);

module.exports = router;
