/**
 * My Bookings Page Component
 * 
 * Displays all bookings made by the current user
 * Users can cancel their bookings
 */

import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch user's bookings when component loads
   */
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsAPI.getMyBookings();
      setBookings(data);
    } catch (error) {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel a booking
   */
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      // Refresh bookings list
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="my-bookings-page">
      <h1>My Bookings</h1>
      <p>View and manage your room and lab bookings.</p>

      {bookings.length === 0 ? (
        <div className="card">
          <p>You don't have any bookings yet.</p>
          <a href="/rooms" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>
            Browse Rooms
          </a>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{booking.roomId?.name || 'Room'}</h3>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                  <p><strong>Purpose:</strong> {booking.purpose}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      style={{
                        color: booking.status === 'confirmed' ? '#28a745' : '#dc3545',
                        fontWeight: 'bold',
                      }}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </p>
                  {booking.roomId && (
                    <p style={{ marginTop: '10px', color: '#666' }}>
                      <small>
                        {booking.roomId.type} • Capacity: {booking.roomId.capacity}
                      </small>
                    </p>
                  )}
                </div>
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="btn btn-danger"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
