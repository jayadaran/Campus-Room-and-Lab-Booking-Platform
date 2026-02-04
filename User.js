/**
 * User Model (Database Schema)
 * 
 * This defines the structure of user documents in MongoDB
 * Each user can be a student, faculty, or admin
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing passwords

// Define the user schema (structure of user data)
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, 'Please provide a name'], // Required field with error message
      trim: true, // Remove extra spaces
    },
    
    // User's email address (must be unique)
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true, // No two users can have the same email
      lowercase: true, // Convert to lowercase
      trim: true,
    },
    
    // User's password (will be hashed before saving)
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default when querying
    },
    
    // User's role: student, faculty, or admin
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'], // Only these values allowed
      default: 'student', // Default role is student
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

/**
 * Before saving a user, hash the password
 * This runs automatically when creating or updating a user
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it's been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password with bcrypt (10 rounds of salting)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Method to compare password with hashed password
 * Used during login to verify the password
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
