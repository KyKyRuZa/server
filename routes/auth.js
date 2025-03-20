const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/check-email', authController.checkEmail);
router.post('/forgot-password', authController.sendResetEmail);
router.post('/reset-password', authController.resetPassword);


module.exports = router;
