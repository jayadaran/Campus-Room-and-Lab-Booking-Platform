/**
 * Main Server File
 * 
 * This is the entry point of the backend application
 * It sets up Express server, connects to database, and defines routes
 */

const express = require('express');
const cors = require('cors'); // Allows frontend to make requests to backend
const dotenv = require('dotenv'); // Load environment variables
const connectDB = require('./config/db'); // Database connection

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize Express app
const app = express();

// Middleware: Parse JSON data from requests
app.use(express.json());

// Middleware: Enable CORS (Cross-Origin Resource Sharing)
// This allows the React frontend (running on different port) to make requests
app.use(cors());

// Define API routes
// All routes are prefixed with /api
app.use('/api/auth', require('./routes/authRoutes')); // Authentication routes
app.use('/api/rooms', require('./routes/roomRoutes')); // Room management routes
app.use('/api/bookings', require('./routes/bookingRoutes')); // Booking routes

// Root route (just for testing)
app.get('/', (req, res) => {
  res.json({ message: 'Campus Booking API is running!' });
});

// Error handling middleware (catches any errors in routes)
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || 'Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
