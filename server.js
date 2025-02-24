const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const auth = require('./routes/auth');
const product = require('./routes/product');
const basket = require('./routes/basket');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', auth);
app.use('/api/', product);
app.use('/uploads', express.static('uploads'));
app.use('/api/', basket);

// Запуск сервера
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL подключен');
    await sequelize.sync(); 
    const PORT = process.env.PORT || 6000
    const IP = process.env.DB_HOST || 'localhost'
    const DBPORT = process.env.DB_PORT || 5432
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT} и IP ${IP}:${DBPORT}`);
    });
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
};

startServer();
