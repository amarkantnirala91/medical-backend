const express = require('express');
const { createSubscription, getSubscriptionPlan } = require('../controllers/subscription.controller');
const router = express.Router();

router.post('/subscription', createSubscription);
router.get('/subscription', getSubscriptionPlan);
module.exports = router