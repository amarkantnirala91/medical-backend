const express = require('express');
const { addExercisePlan, getExercisePlan } = require('../controller/exercise-plan.controller');
const router = express.Router();

router.post('/exercise-plan/:appointmentId/:clientId/:yogaTrainerId', addExercisePlan);
router.get('/exercise-plan/', getExercisePlan, getExercisePlan);
module.exports = router