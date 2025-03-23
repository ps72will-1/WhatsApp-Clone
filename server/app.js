// server/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chats', require('./routes/chat'));
app.use('/api/messages', require('./routes/message'));
app.use('/api/users', require('./routes/user'));
app.use('/api/status', require('./routes/status'));
app.use('/api/config', require('./routes/config'));

// Get App configuration route
app.get('/api/app-config', (req, res) => {
  res.json({
    appName: process.env.APP_NAME || 'ChatConnect',
    logoPath: process.env.APP_LOGO_PATH || '/img/logo.png'
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;