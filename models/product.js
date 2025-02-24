const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING(100), 
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
            min: 0 
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
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending',
    }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    paranoid: true, // Enable soft deletes (deletedAt field)
});

// Optional: Define instance methods or static methods here if needed

module.exports = Product;
