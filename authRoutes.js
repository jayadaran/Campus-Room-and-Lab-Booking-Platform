/**
 * Authentication Routes
 * 
 * Handles user registration and login
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Helper function to generate JWT token
 * Creates a token that expires in 30 days
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public (anyone can register)
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation: Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    // Note: Password will be automatically hashed by the User model's pre-save hook
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student', // Default to student if not specified
    });

    // If user created successfully, return user data and token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Generate and return JWT token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email and include password (normally password is excluded)
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Generate and return JWT token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private (requires authentication)
 */
router.get('/me', protect, async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
