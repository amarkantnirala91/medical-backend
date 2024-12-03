const express = require('express');
const { getAllUser, updateUser } = require('../controllers/users.controller');
const { createClient, updateClient } = require('../controllers/client.controller');
const router = express.Router();

router.get('/users', getAllUser);
router.post('/client-signup/:userId', createClient);
router.put('/client/:userId', updateClient);
router.put('/user/:userId', updateUser);

module.exports = router