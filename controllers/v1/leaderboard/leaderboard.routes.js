const express = require('express');

const router = express.Router();

const leaderboardController = require('./leaderboard.controller');

const { authentication, authorization } = require('../../../middleware/middleware');

router.get('', authentication, authorization, leaderboardController.getAll);
router.get('/myscore', authentication, authorization, leaderboardController.getMyScore);

module.exports = router;
