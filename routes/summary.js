const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/', summaryController.getFinancialSummary);

module.exports = router;
