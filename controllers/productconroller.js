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
            const {  name, description, price, quantity, category } = req.body;
            const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

            const newProduct = await Product.create({
                name,
                imageUrl,
                description,
                price,
                quantity,
                category,
            });

            res.status(200).json(newProduct);
        } catch (error) {
            console.error('Ошибка добавления товара:', error);
            res.status(400).json({ error: 'Ошибка добавления товара' });
        }
    },
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price, quantity, category } = req.body;
            const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
    
            const [updated] = await Product.update({
                name,
                description,
                price,
                quantity,
                category,
                ...(imageUrl && { imageUrl })
            }, {
                where: { id }
            });
    
            if (updated) {
                const updatedProduct = await Product.findByPk(id);
                return res.status(200).json(updatedProduct);
            }
            return res.status(404).json({ message: 'Продукт не найден' });
            
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении продукта' });
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