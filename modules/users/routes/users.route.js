const express = require('express');
const { getAllUser, updateUser, getUserById } = require('../controllers/users.controller');
const { createClient, updateClient } = require('../controllers/client.controller');
const router = express.Router();

router.get('/users', getAllUser);
router.get('/user/:userId', getUserById);
router.post('/client-signup/:userId', createClient);
router.put('/client/:userId', updateClient);
router.put('/user/:userId', updateUser);

module.exports = router