const express = require('express');
const { getAllUser } = require('../controllers/users.controller');
const router = express.Router();

router.get('/users', getAllUser);

module.exports = router