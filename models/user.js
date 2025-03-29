const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [6, 255]
        }
    },
    
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            len: [2, 50]
        }
    },
    
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            len: [2, 50]
        }
    },
    
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active'
    },

    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
        }
    },
    
    role: {
        type: DataTypes.ENUM(['user', 'admin']),
        defaultValue: 'user'
    },
    
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true, 
    paranoid: true,
});


User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
};


User.findByEmail = async function(email) {
    return await this.findOne({ where: { email } });
};

module.exports = User;
