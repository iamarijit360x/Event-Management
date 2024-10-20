const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const mongoURI = process.env.DB_URL;

// Connect to MongoDB
const connection = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = connection;
