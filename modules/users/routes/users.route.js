const express = require('express');
const { getAllUser } = require('../controllers/users.controller');
const { createClient } = require('../controllers/client.controller');
const router = express.Router();

router.get('/users', getAllUser);
router.post('/client-signup/:userId', createClient);

module.exports = router