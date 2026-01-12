const { Server } = require('socket.io');

let io;

// Store user socket connections (userId -> socketId)
const userSockets = new Map();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    // Register user when they connect
    socket.on('register', (userId) => {
      if (userId) {
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Remove user from map
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

const getUserSocketId = (userId) => {
  return userSockets.get(userId.toString());
};

const emitToUser = (userId, event, data) => {
  const socketId = getUserSocketId(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
    console.log(`Emitted '${event}' to user ${userId}`);
    return true;
  }
  console.log(`User ${userId} not connected`);
  return false;
};

module.exports = {
  initializeSocket,
  getIO,
  emitToUser
};
