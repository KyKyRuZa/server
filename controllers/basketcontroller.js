const Basket = require('../models/basket');
const Product = require('../models/product');

const basketController = {
    async addToBasket(req, res) {
        try {
            const { userId, productId, quantity } = req.body;
            
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const totalAmount = product.price * quantity;

            const basketItem = await Basket.create({
                userId,
                productId,
                quantity,
                totalAmount
            });

            res.status(201).json(basketItem);
        } catch (error) {
            console.error('Error adding to basket:', error);
            res.status(500).json({ error: 'Error adding to basket' });
        }
    },

    async getBasket(req, res) {
        try {
            const basketItems = await Basket.findAll({
                where: { userId: req.params.userId },
                include: [{
                    model: Product,
                    attributes: ['name', 'description', 'price', 'imageUrl']
                }]
            });
            
            if (basketItems.length === 0) {
                return res.status(404).json({ message: 'Корзина пуста' });
            }
            
            res.status(200).json(basketItems);
        } catch (error) {
            console.error('Ошибка при получении корзины:', error);
            res.status(500).json({ 
                error: 'Ошибка при получении корзины',
                details: error.message 
            });
        }
    },

    async removeFromBasket(req, res) {
        try {
            const { userId, productId } = req.params;
            await Basket.destroy({
                where: { userId, productId }
            });
            res.status(200).json({ message: 'Товар успешно удален из корзины' });
        } catch (error) {
            console.error('Ошибка при удалении из корзины:', error);
            res.status(500).json({ error: 'Ошибка при удалении из корзины' });
        }
    },
    
    async incrementQuantity(req, res) {
        try {
            const { userId, productId } = req.body;
            if (!productId) {
                return res.status(400).json({ error: 'ProductId is required' });
            }
            const basketItem = await Basket.findOne({
                where: { userId, productId },
                include: [{
                    model: Product,
                    attributes: ['price']
                }]
            });

            if (!basketItem) {
                return res.status(404).json({ error: 'Basket item not found' });
            }

            await basketItem.increment('quantity', { by: 1 });
            await basketItem.reload();
            
            const newTotalAmount = basketItem.quantity * basketItem.Product.price;
            basketItem.totalAmount = newTotalAmount;
            await basketItem.save();

            res.status(200).json(basketItem);
        } catch (error) {
            console.error('Error incrementing quantity:', error);
            res.status(500).json({ error: 'Error incrementing quantity' });
        }
    },

    async decrementQuantity(req, res) {
        try {
            const { userId, productId } = req.body;
            if (!productId) {
                return res.status(400).json({ error: 'ProductId is required' });
            }
            const basketItem = await Basket.findOne({
                where: { userId, productId },
                include: [{
                    model: Product,
                    attributes: ['price']
                }]
            });

            if (basketItem.quantity > 1) {
                await basketItem.decrement('quantity', { by: 1 });
                await basketItem.reload();
                
                const newTotalAmount = basketItem.quantity * basketItem.Product.price;
                basketItem.totalAmount = newTotalAmount;
                await basketItem.save();
            }

            res.status(200).json(basketItem);
        } catch (error) {
            console.error('Error decrementing quantity:', error);
            res.status(500).json({ error: 'Error decrementing quantity' });
        }
    }
};

module.exports = basketController;
