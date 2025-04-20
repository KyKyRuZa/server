const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
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
    category: {
        type: DataTypes.ENUM(
            'Отсутствует',
            'Авто краски',
            'Аэрозольные краски',
            'Аэрозольные краски RAL/NCS/PANTONE',
            'Термостойкие краски',
            'Автоэмаль с кисточкой',
            'Аэрозольные лаки',
            'Аэрозольные грунты'
        ),
        defaultValue: 'Отсутствует',
        allowNull: false 
    },
    status: {
        type: DataTypes.ENUM('Ожидание', 'Закончено', 'Отменено'),
        defaultValue: 'Ожидание',
        allowNull: false
    },
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Product;
