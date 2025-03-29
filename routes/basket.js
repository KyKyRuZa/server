const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketcontroller');

router.post('/add', basketController.addToBasket);
router.get('/:userId', basketController.getBasket);
router.put('/increment', basketController.incrementQuantity);
router.put('/decrement', basketController.decrementQuantity);
router.delete('/:userId/:productId', basketController.removeFromBasket);

module.exports = router;