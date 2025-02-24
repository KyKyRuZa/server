const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


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

const userController = {
  async createUser(req, res) {
    try {
      const { username, email, password, firstName, lastName, bio } = req.body;
      const user = await User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        bio
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async getUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = {
  register: authController.register,
  login: authController.login,
  createUser: userController.createUser,
  getUser: userController.getUser
};
