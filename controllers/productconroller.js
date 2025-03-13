const Product = require('../models/product');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/var/www/uploads/'); // Новая директория
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Имя файла
    }
  });

const upload = multer({ storage: storage });

const productController = {
    uploadImage: upload.single('image'),
    
    async createProduct(req, res) {
        try {   
            const {  name, description, price, category } = req.body;
            const imageUrl = req.file ? `https://delron.ru/uploads/${req.file.filename}` : null;

            const newProduct = await Product.create({
                name,
                imageUrl,
                description,
                price,
                category,
            });

            res.status(200).json(newProduct);
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(400).json({ error: 'Error adding product' });
        }
    },
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            await product.update(updates);
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await Product.destroy({
                where: { id }
            });
            res.status(200).json({ message: 'Продукт успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            res.status(500).json({ error: 'Ошибка при удалении продукта' });
        }
    },
    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll(); 
    
            if (products.length === 0) {
                return res.status(404).json({ message: 'Товары не найдены' });
            }
    
            res.status(200).json(products);
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
            res.status(500).json({ 
                error: 'Ошибка при получении продуктов',
                details: error.message 
            });
        }
    },
    
    
    
};

module.exports = productController;