/**
 * Room Routes
 * 
 * Handles CRUD operations for rooms and labs
 * - GET all rooms (public)
 * - GET single room (public)
 * - POST create room (admin only)
 * - PUT update room (admin only)
 * - DELETE room (admin only)
 */

const express = require('express');
const Room = require('../models/Room');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/rooms
 * @desc    Get all rooms
 * @access  Public (anyone can view rooms)
 */
router.get('/', async (req, res) => {
  try {
    // Find all rooms
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/rooms/:id
 * @desc    Get a single room by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/rooms
 * @desc    Create a new room
 * @access  Private/Admin (only admins can create rooms)
 */
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, type, capacity, facilities, description, available } = req.body;

    // Validation
    if (!name || !type || !capacity) {
      return res.status(400).json({ message: 'Please provide name, type, and capacity' });
    }

    // Check if room with same name already exists
    const roomExists = await Room.findOne({ name });
    if (roomExists) {
      return res.status(400).json({ message: 'Room with this name already exists' });
    }

    // Create new room
    const room = await Room.create({
      name,
      type,
      capacity,
      facilities: facilities || [],
      description,
      available: available !== undefined ? available : true,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/rooms/:id
 * @desc    Update a room
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, type, capacity, facilities, description, available } = req.body;

    // Find room by ID
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Update room fields (only update fields that are provided)
    if (name) room.name = name;
    if (type) room.type = type;
    if (capacity) room.capacity = capacity;
    if (facilities) room.facilities = facilities;
    if (description !== undefined) room.description = description;
    if (available !== undefined) room.available = available;

    // Save updated room
    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/rooms/:id
 * @desc    Delete a room
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await room.deleteOne();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
