const express = require('express');
const { signIn, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/sign-in', signIn)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
module.exports = router