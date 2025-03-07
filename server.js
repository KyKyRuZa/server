const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const auth = require('./routes/auth');
const product = require('./routes/product');
const basket = require('./routes/basket');

require('dotenv').config();

const app = express();
// HTTPS сервер
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/delron.ru/privkey.pem'), // Приватный ключ
  cert: fs.readFileSync('/etc/letsencrypt/live/delron.ru/fullchain.pem') // Сертификат
};

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
    https.createServer(options, app).listen(PORT, () => {
      console.log(`HTTPS Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
};

startServer();

