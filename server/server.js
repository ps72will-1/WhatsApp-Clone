// server/server.js
const http = require('http');
const app = require('./app');
const socketIo = require('socket.io');
const socketConfig = require('./config/socket');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Configure socket events
socketConfig(io);

// Port
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`App name: ${process.env.APP_NAME || 'ChatConnect'}`);
});