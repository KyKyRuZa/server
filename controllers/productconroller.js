const Product = require('../models/product');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const productController = {
    uploadImage: upload.single('image'),
    
    async createProduct(req, res) {
        try {   
            const { name, description, price } = req.body;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

            const newProduct = await Product.create({
                name,
                description,
                price,
                imageUrl
            });

            res.status(200).json(newProduct);
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(400).json({ error: 'Error adding product' });
        }
    },

    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll({
                attributes: ['id', 'name', 'description', 'price', 'status', 'paymentStatus', 'imageUrl'],
                order: [['createdAt', 'DESC']]
            }); 
    
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
    async editProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price, status, paymentStatus } = req.body;

            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).json({ error: 'Продукт не найден' });
            }

            product.name = name;
            product.description = description;
            product.price = price;
            product.status = status;
            product.paymentStatus = paymentStatus;

            await product.save();

            res.status(200).json(product);
        } catch (error) {
            console.error('Ошибка при редактировании продукта:', error);
            res.status(500).json({ error: 'Ошибка при редактировании продукта' });
        }
    }
    
};


module.exports = productController;
