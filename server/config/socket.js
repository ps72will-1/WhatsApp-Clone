// server/config/socket.js
const User = require('../models/User');
const Message = require('../models/Message');

module.exports = (io) => {
  // Store user socket mappings
  const userSockets = new Map();
  
  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);
    
    // Handle user connection with authentication
    socket.on('setup', async (userData) => {
      if (!userData || !userData._id) {
        return;
      }
      
      // Join user to their own room
      socket.join(userData._id);
      console.log(`User ${userData._id} connected`);
      
      // Store socket mapping
      userSockets.set(userData._id, socket.id);
      
      // Update user status to online
      try {
        await User.findByIdAndUpdate(userData._id, { isOnline: true, lastSeen: Date.now() });
        
        // Broadcast user's online status to contacts
        const user = await User.findById(userData._id).populate('contacts');
        
        if (user && user.contacts) {
          user.contacts.forEach((contact) => {
            socket.to(contact._id.toString()).emit('user-status-update', {
              userId: userData._id,
              isOnline: true,
              lastSeen: Date.now(),
            });
          });
        }
      } catch (error) {
        console.error('Socket setup error:', error);
      }
      
      socket.emit('connected');
    });
    
    // Join a chat room
    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });
    
    // Typing indicator
    socket.on('typing', (chatId) => {
      socket.to(chatId).emit('typing', chatId);
    });
    
    // Stop typing indicator
    socket.on('stop-typing', (chatId) => {
      socket.to(chatId).emit('stop-typing', chatId);
    });
    
    // New message
    socket.on('new-message', (messageData) => {
      const chat = messageData.chat;
      
      if (!chat.users) return;
      
      // Send message to all users in the chat except the sender
      chat.users.forEach((user) => {
        if (user._id !== messageData.sender._id) {
          socket.to(user._id).emit('message-received', messageData);
        }
      });
    });
    
    // Message delivered
    socket.on('message-delivered', async (data) => {
      try {
        const { messageId, userId } = data;
        
        // Update message in database
        // This would be implemented in your message controller
        
        // Notify sender
        const message = await Message.findById(messageId).populate('sender');
        if (message) {
          socket.to(message.sender._id.toString()).emit('message-delivery-status', {
            messageId,
            userId,
            status: 'delivered',
          });
        }
      } catch (error) {
        console.error('Message delivered error:', error);
      }
    });
    
    // Message read
    socket.on('message-read', async (data) => {
      try {
        const { messageId, userId } = data;
        
        // Update message in database
        // This would be implemented in your message controller
        
        // Notify sender
        const message = await Message.findById(messageId).populate('sender');
        if (message) {
          socket.to(message.sender._id.toString()).emit('message-delivery-status', {
            messageId,
            userId,
            status: 'read',
          });
        }
      } catch (error) {
        console.error('Message read error:', error);
      }
    });
    
    // Call signaling
    socket.on('call-user', (data) => {
      const { userToCall, signalData, from, callType } = data;
      
      socket.to(userToCall).emit('incoming-call', {
        signal: signalData,
        from,
        callType,
      });
    });
    
    socket.on('answer-call', (data) => {
      socket.to(data.to).emit('call-accepted', data.signal);
    });
    
    socket.on('end-call', (data) => {
      socket.to(data.to).emit('call-ended');
    });
    
    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      // Find user by socket id
      const userId = [...userSockets.entries()]
        .find(([_, socketId]) => socketId === socket.id)?.[0];
      
      if (userId) {
        // Remove from socket mapping
        userSockets.delete(userId);
        
        // Update user status to offline
        try {
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: Date.now(),
          });
          
          // Broadcast user's offline status to contacts
          const user = await User.findById(userId).populate('contacts');
          
          if (user && user.contacts) {
            user.contacts.forEach((contact) => {
              socket.to(contact._id.toString()).emit('user-status-update', {
                userId,
                isOnline: false,
                lastSeen: Date.now(),
              });
            });
          }
        } catch (error) {
          console.error('Socket disconnect error:', error);
        }
      }
    });
  });
};