const Router = require('express');
const router = new Router();
const profileController = require('../controllers/profilecontroller');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/update/:userId', authMiddleware, profileController.updateProfile);
router.put('/password/:userId', authMiddleware, profileController.updatePassword);
router.get('/:userId', authMiddleware, profileController.getProfile);
router.put('/personal/:userId', authMiddleware, profileController.updatePersonalInfo);



module.exports = router;