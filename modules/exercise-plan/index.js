const express = require('express');
const router = express.Router();

// Define routes for the company plugin here
router.use('/', require('./routes/exercise-route'));

module.exports = router;
