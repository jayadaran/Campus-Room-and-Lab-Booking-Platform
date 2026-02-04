/**
 * Database Connection Configuration
 * 
 * This file handles connecting to MongoDB database
 * Mongoose is a library that makes working with MongoDB easier
 */

const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

/**
 * Connect to MongoDB database
 * This function is called when the server starts
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options help with compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // If connection successful, log a success message
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and exit the application
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with error code 1
  }
};

module.exports = connectDB;
