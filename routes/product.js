const express = require('express');
const router = express.Router();
const productController = require('../controllers/productconroller');

router.post('/', productController.uploadImage, productController.createProduct);
router.get('/', productController.getAllProducts);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
