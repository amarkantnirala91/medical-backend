const express = require('express');
const { createSubscription } = require('../controllers/subscription.controller');
const router = express.Router();

router.post('/subscription', createSubscription);
module.exports = router