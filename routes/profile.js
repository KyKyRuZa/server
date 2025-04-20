const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profilecontroller');
const authMiddleware = require('../middleware/authmiddleware');

router.put('/settings/update/:userId', authMiddleware, profileController.updateProfile);
router.put('/settings/password/:userId', authMiddleware, profileController.updatePassword);
router.get('/settings/:userId', authMiddleware, profileController.getProfile);
router.put('/settings/personal/:userId', authMiddleware, profileController.updatePersonalInfo);
router.get('/statistics', authMiddleware, profileController.getStatistics);
router.get('/users', authMiddleware, profileController.getAllUsers);

module.exports = router;