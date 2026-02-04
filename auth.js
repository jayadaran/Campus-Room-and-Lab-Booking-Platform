/**
 * Authentication Middleware
 * 
 * This middleware protects routes that require authentication
 * It verifies the JWT token sent by the frontend
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware function to protect routes
 * This runs before the actual route handler
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  // Format: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the token (but exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      // If user not found, token is invalid
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // If everything is OK, continue to the next middleware/route
      next();
    } catch (error) {
      // If token is invalid or expired
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token provided
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Middleware to check if user is admin
 * Must be used after protect middleware
 */
const admin = (req, res, next) => {
  // Check if user exists and is admin
  if (req.user && req.user.role === 'admin') {
    next(); // Continue to the route
  } else {
    // If not admin, return error
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

module.exports = { protect, admin };
