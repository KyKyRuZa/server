const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');

const auth = require('./routes/auth');
const product = require('./routes/product');
const basket = require('./routes/basket');
const profile = require('./routes/profile');

require('dotenv').config();

const app = express();

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/delron.ru/privkey.pem'), // Private key
  cert: fs.readFileSync('/etc/letsencrypt/live/delron.ru/fullchain.pem') // Certificate
};

const server = https.createServer(options, app);
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', auth);
app.use('/api/profile/admin-catalog', product);
app.use('/api/profile/basket', basket);
app.use('/api/profile/settings', profile);
app.use('/uploads', express.static('/var/www/uploads/'));

// Start the server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected');
        await sequelize.sync();
        const PORT = process.env.PORT || 6000;
        server.listen(PORT, () => {
            console.log(`HTTPS Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

startServer();
