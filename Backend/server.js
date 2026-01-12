require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.io is initialized`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});