const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const userController = require('../controllers/authcontroller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/users', userController.createUser);



module.exports = router;
