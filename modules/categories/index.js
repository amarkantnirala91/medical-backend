const express = require('express');
const router = express.Router();

// Define routes for the company plugin here
router.use('/', require('./routes/category.route'));
router.use('/', require('./routes/sub-category.route'));

module.exports = router;
