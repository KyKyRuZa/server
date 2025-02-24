const express = require('express');
const router = express.Router();
const productController = require('../controllers/productconroller');

router.post('/profile', productController.uploadImage, productController.createProduct);
router.get('/profile', productController.getAllProducts);
router.delete('/profile/:id', productController.deleteProduct);
module.exports = router;
