const User = require('../models/user');
const bcrypt = require('bcrypt');

const profileController = {
    async updateProfile(req, res) {
        try {
            const { userId } = req.params;
            const { firstName, lastName, phone } = req.body;
            
            const updatedUser = await User.update(
                { firstName, lastName, phone },
                { where: { id: userId } }
            );
            
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: "Ошибка при обновлении профиля" });
        }
    },

    async updatePassword(req, res) {
        try {
            const { userId } = req.params;
            const { currentPassword, newPassword, confirmPassword } = req.body;
            
            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ 
                    message: "Все поля должны быть заполнены" 
                });
            }
    
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ 
                    message: "Новые пароли не совпадают" 
                });
            }
    
            const user = await User.findByPk(userId);
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            
            if (!isValidPassword) {
                return res.status(400).json({ 
                    message: "Неверный текущий пароль" 
                });
            }
    
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await user.update({ password: hashedPassword });
    
            res.json({ message: "Пароль успешно обновлен" });
        } catch (error) {
            res.status(500).json({ 
                message: "Ошибка при обновлении пароля" 
            });
        }
    },

    async updatePersonalInfo(req, res) {
        try {
            const { userId } = req.params;
            const { firstName, lastName, phone } = req.body;
            
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
    
            await user.update({
                firstName,
                lastName,
                phone
            });
    
            res.json({
                message: "Личные данные успешно обновлены",
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone
                }
            });
        } catch (error) {
            res.status(500).json({ message: "Ошибка при обновлении личных данных" });
        }
    },

    async getProfile(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findByPk(userId);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Ошибка при получении профиля" });
        }
    }
};

module.exports = profileController;
