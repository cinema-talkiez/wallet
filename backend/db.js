// backend/db.js
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB Connected (Serverless)');
  } catch (err) {
    console.error('DB Connection Failed:', err);
    throw err;
  }
};

module.exports = connectDB;
