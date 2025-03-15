const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketcontroller');

router.post('/add', basketController.addToBasket);
router.get('/:userId', basketController.getBasket);
router.put('/basket/increment', basketController.incrementQuantity);
router.put('/basket/decrement', basketController.decrementQuantity);
router.delete('/:userId/:productId', basketController.removeFromBasket);


module.exports = router;