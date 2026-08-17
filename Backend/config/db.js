// config/db.js
const mongoose = require('mongoose');

// Mongoose connection state listeners
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection FAILED: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection disconnected');
});

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    const msg = 'MONGO_URI is missing from environment variables (.env)';
    console.error(`MongoDB connection FAILED: ${msg}`);
    throw new Error(msg);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected');
    return conn;
  } catch (error) {
    console.error(`MongoDB connection FAILED: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;