/**
 * Room Model (Database Schema)
 * 
 * This defines the structure of room/lab documents in MongoDB
 * Rooms can be classrooms or labs
 */

const mongoose = require('mongoose');

// Define the room schema
const roomSchema = new mongoose.Schema(
  {
    // Room name (e.g., "Lab 101", "Classroom A")
    name: {
      type: String,
      required: [true, 'Please provide a room name'],
      trim: true,
      unique: true, // Each room must have a unique name
    },
    
    // Type of room: classroom or lab
    type: {
      type: String,
      enum: ['classroom', 'lab'], // Only these two types allowed
      required: [true, 'Please specify room type'],
    },
    
    // Maximum capacity (number of people)
    capacity: {
      type: Number,
      required: [true, 'Please provide room capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    
    // Facilities available in the room (array of strings)
    facilities: {
      type: [String], // Array of strings like ["projector", "computers", "whiteboard"]
      default: [], // Default to empty array
    },
    
    // Whether the room is currently available for booking
    available: {
      type: Boolean,
      default: true, // Default to available
    },
    
    // Optional description of the room
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create and export the Room model
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
