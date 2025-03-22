require('dotenv').config();
const { Op } = require('sequelize');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 60000,
    debug: true, 
    logger: true
});
const authController = {
    async register(req, res) {
        try {
            const { username, email, password, firstName, lastName } = req.body;
            
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName
            });

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                token,
                user: user.toJSON()
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },
    async checkEmail(req, res) {
        try {
            const user = await User.findOne({
                where: { email: req.body.email }
            });
            res.json({ exists: !!user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async sendResetEmail(req, res) {
        try {
            const user = await User.findOne({
                where: { email: req.body.email }
            });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            await user.update({
                resetToken: resetToken,
                resetTokenExpiry: new Date(Date.now() + 900000)
            });

            const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
            
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Восстановление пароля',
                html: `
                    <h2>Восстановление пароля</h2>
                    <p>Здравствуйте!</p>
                    <p>Вы получили это письмо, так как был запрошен сброс пароля для вашей учетной записи. Для завершения процедуры восстановления пароля, пожалуйста, перейдите по ссылке ниже:</p>
                    <a href="${resetLink}" class="reset-link">Сбросить пароль</a>
                    <p>Внимание! Данная ссылка действительна только в течение <strong>15 минут</strong>. Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
                    <div>
                        <p>С уважением,<br>Команда поддержки ООО "DELRON"</p>
                    </div>
                `
            });

            res.json({ message: 'Письмо успешно отправлено!' });
        } catch (error) {
            console.error('Ошибка при отправке письма:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async resetPassword(req, res) {
        try {
            const user = await User.findOne({
                where: {
                    resetToken: req.body.token,
                    resetTokenExpiry: {
                        [Op.gt]: new Date()
                    }
                }
            });
    
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }
    
            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
            
            await user.update({
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            });
    
            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            await user.update({ lastLogin: new Date() });

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user: user.toJSON()
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = authController;
