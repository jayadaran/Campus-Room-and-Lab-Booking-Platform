/**
 * Book Room Page Component
 * 
 * Allows users to book a specific room for a date and time
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomsAPI, bookingsAPI } from '../services/api';

function BookRoom({ user }) {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // State
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });

  /**
   * Fetch room details when component loads
   */
  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const data = await roomsAPI.getById(roomId);
      setRoom(data);
      
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, date: today }));
    } catch (error) {
      setError('Room not found');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validation
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.purpose) {
      setError('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Cannot book rooms for past dates');
      setSubmitting(false);
      return;
    }

    try {
      // Create booking
      await bookingsAPI.create({
        roomId,
        ...formData,
      });

      setSuccess(true);
      
      // Redirect to my bookings after 2 seconds
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading room details...</div>;
  }

  if (!room) {
    return <div className="alert alert-error">Room not found</div>;
  }

  if (success) {
    return (
      <div className="card">
        <div className="alert alert-success">
          <h3>✅ Booking Successful!</h3>
          <p>Your booking has been confirmed. Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-room-page">
      <h1>Book {room.name}</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        {room.type.charAt(0).toUpperCase() + room.type.slice(1)} • Capacity: {room.capacity}
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Purpose</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              placeholder="e.g., Lab session, Group study, Presentation..."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookRoom;
