const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketcontroller');

router.post('/profile/add', basketController.addToBasket);
router.get('/profile/:userId', basketController.getBasket);
router.put('/profile/increment', basketController.incrementQuantity);
router.put('/profile/decrement', basketController.decrementQuantity);
router.delete('/profile/:userId/:productId', basketController.removeFromBasket);

module.exports = router;