/**
 * Booking Routes
 * 
 * Handles booking operations:
 * - GET user's bookings
 * - GET all bookings (admin only)
 * - POST create booking
 * - DELETE cancel booking
 */

const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

/**
 * Helper function to check if time slots overlap
 * Returns true if there's an overlap
 */
const hasTimeOverlap = (start1, end1, start2, end2) => {
  // Convert time strings to minutes for easier comparison
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  // Check if time ranges overlap
  return start1Min < end2Min && start2Min < end1Min;
};

/**
 * @route   GET /api/bookings
 * @desc    Get current user's bookings
 * @access  Private (requires authentication)
 */
router.get('/', protect, async (req, res) => {
  try {
    // Find all bookings for the current user
    // Populate room details and user details
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('roomId', 'name type capacity facilities') // Include room details
      .populate('userId', 'name email') // Include user details
      .sort({ date: -1, startTime: -1 }); // Sort by date and time (newest first)

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/bookings/all
 * @desc    Get all bookings (admin only)
 * @access  Private/Admin
 */
router.get('/all', protect, admin, async (req, res) => {
  try {
    // Find all bookings (admin can see everyone's bookings)
    const bookings = await Booking.find({})
      .populate('roomId', 'name type capacity')
      .populate('userId', 'name email role')
      .sort({ date: -1, startTime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private (requires authentication)
 */
router.post('/', protect, async (req, res) => {
  try {
    const { roomId, date, startTime, endTime, purpose } = req.body;

    // Validation: Check if all required fields are provided
    if (!roomId || !date || !startTime || !endTime || !purpose) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if room exists and is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (!room.available) {
      return res.status(400).json({ message: 'Room is not available for booking' });
    }

    // Validate time format (should be HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ message: 'Invalid time format. Use HH:MM (24-hour format)' });
    }

    // Validate that end time is after start time
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    if (endMinutes <= startMinutes) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Check for existing bookings on the same date and room with overlapping times
    const existingBookings = await Booking.find({
      roomId,
      date,
      status: 'confirmed', // Only check confirmed bookings
    });

    // Check if any existing booking overlaps with the new booking time
    const hasConflict = existingBookings.some((booking) =>
      hasTimeOverlap(startTime, endTime, booking.startTime, booking.endTime)
    );

    if (hasConflict) {
      return res.status(400).json({
        message: 'Room is already booked for this time slot. Please choose a different time.',
      });
    }

    // Create the booking
    const booking = await Booking.create({
      userId: req.user._id, // Current user's ID (from protect middleware)
      roomId,
      date,
      startTime,
      endTime,
      purpose,
      status: 'confirmed',
    });

    // Populate room and user details before sending response
    await booking.populate('roomId', 'name type capacity facilities');
    await booking.populate('userId', 'name email');

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking
 * @access  Private (users can cancel their own bookings, admins can cancel any)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is an admin
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Update booking status to cancelled (or delete it)
    // We'll delete it for simplicity, but you could also set status to 'cancelled'
    await booking.deleteOne();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
