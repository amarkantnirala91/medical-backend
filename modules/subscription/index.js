const express = require('express');
const router = express.Router();
router.use('/', require('./routes/subscription.route'));

module.exports = router;
