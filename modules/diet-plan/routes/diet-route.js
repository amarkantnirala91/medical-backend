const express = require('express');
const { addDietPlan, getDietPlan } = require('../controller/diet-plan.controller');
const router = express.Router();

router.post('/diet-plan/:appointmentId/:clientId/:nutritionistId', addDietPlan);
router.get('/diet-plan/', getDietPlan);
module.exports = router