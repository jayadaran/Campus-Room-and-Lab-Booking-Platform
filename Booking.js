/**
 * Booking Model (Database Schema)
 * 
 * This defines the structure of booking documents in MongoDB
 * Each booking links a user to a room for a specific time slot
 */

const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema(
  {
    // Reference to the user who made the booking
    userId: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to User model
      required: [true, 'User ID is required'],
    },
    
    // Reference to the room being booked
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room', // Reference to Room model
      required: [true, 'Room ID is required'],
    },
    
    // Date of the booking (format: YYYY-MM-DD)
    date: {
      type: String,
      required: [true, 'Booking date is required'],
    },
    
    // Start time (format: HH:MM, 24-hour format)
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    
    // End time (format: HH:MM, 24-hour format)
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    
    // Purpose of the booking
    purpose: {
      type: String,
      required: [true, 'Please provide a purpose for the booking'],
      trim: true,
    },
    
    // Booking status
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'], // Only these statuses allowed
      default: 'confirmed', // Default to confirmed
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

/**
 * Compound Index: Prevent double booking
 * 
 * This ensures that the same room cannot be booked
 * for the same date and overlapping time slots
 */
bookingSchema.index({ roomId: 1, date: 1, startTime: 1, endTime: 1 });

// Create and export the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
