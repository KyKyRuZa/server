const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Product = require('./product');

const Basket = sequelize.define('Basket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    timestamps: true,
    paranoid: true
});
Basket.belongsTo(Product, { foreignKey: 'productId' });
module.exports = Basket;
