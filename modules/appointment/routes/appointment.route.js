const express = require('express');
const { bookAppointment, getAppointment, getAppointmentById } = require('../controllers/appointment.controller');
const router = express.Router();

router.post('/appointment', bookAppointment);
router.get('/appointment', getAppointment);
router.get('/appointment/:appointmentId', getAppointmentById);
module.exports = router