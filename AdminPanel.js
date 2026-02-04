/**
 * Admin Panel Component
 * 
 * Allows admins to:
 * - View all bookings
 * - Create, update, and delete rooms
 */

import React, { useState, useEffect } from 'react';
import { roomsAPI, bookingsAPI } from '../services/api';

function AdminPanel({ user }) {
  // State for rooms
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  // State for bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // State for creating/editing room
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    name: '',
    type: 'classroom',
    capacity: '',
    facilities: '',
    description: '',
    available: true,
  });
  const [roomError, setRoomError] = useState('');

  /**
   * Fetch data when component loads
   */
  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await roomsAPI.getAll();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setRoomsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingsAPI.getAll();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  /**
   * Handle room form input changes
   */
  const handleRoomFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomFormData({
      ...roomFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  /**
   * Handle room form submission
   */
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setRoomError('');

    try {
      const roomData = {
        ...roomFormData,
        capacity: parseInt(roomFormData.capacity),
        facilities: roomFormData.facilities
          ? roomFormData.facilities.split(',').map((f) => f.trim())
          : [],
      };

      if (editingRoom) {
        // Update existing room
        await roomsAPI.update(editingRoom._id, roomData);
      } else {
        // Create new room
        await roomsAPI.create(roomData);
      }

      // Reset form and refresh rooms
      setShowRoomForm(false);
      setEditingRoom(null);
      setRoomFormData({
        name: '',
        type: 'classroom',
        capacity: '',
        facilities: '',
        description: '',
        available: true,
      });
      fetchRooms();
    } catch (error) {
      setRoomError(error.response?.data?.message || 'Failed to save room');
    }
  };

  /**
   * Handle edit room
   */
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomFormData({
      name: room.name,
      type: room.type,
      capacity: room.capacity.toString(),
      facilities: room.facilities.join(', '),
      description: room.description || '',
      available: room.available,
    });
    setShowRoomForm(true);
  };

  /**
   * Handle delete room
   */
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await roomsAPI.delete(roomId);
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete room');
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <p>Manage rooms, labs, and view all bookings.</p>

      {/* Rooms Management Section */}
      <div className="card" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Rooms Management</h2>
          <button
            onClick={() => {
              setShowRoomForm(!showRoomForm);
              setEditingRoom(null);
              setRoomFormData({
                name: '',
                type: 'classroom',
                capacity: '',
                facilities: '',
                description: '',
                available: true,
              });
            }}
            className="btn btn-primary"
          >
            {showRoomForm ? 'Cancel' : '+ Add New Room'}
          </button>
        </div>

        {showRoomForm && (
          <form onSubmit={handleRoomSubmit} style={{ marginBottom: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '5px' }}>
            {roomError && <div className="alert alert-error">{roomError}</div>}
            <div className="form-group">
              <label>Room Name</label>
              <input
                type="text"
                name="name"
                value={roomFormData.name}
                onChange={handleRoomFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={roomFormData.type} onChange={handleRoomFormChange} required>
                <option value="classroom">Classroom</option>
                <option value="lab">Lab</option>
              </select>
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={roomFormData.capacity}
                onChange={handleRoomFormChange}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Facilities (comma-separated)</label>
              <input
                type="text"
                name="facilities"
                value={roomFormData.facilities}
                onChange={handleRoomFormChange}
                placeholder="e.g., projector, computers, whiteboard"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={roomFormData.description}
                onChange={handleRoomFormChange}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="available"
                  checked={roomFormData.available}
                  onChange={handleRoomFormChange}
                />
                Available for booking
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              {editingRoom ? 'Update Room' : 'Create Room'}
            </button>
          </form>
        )}

        {roomsLoading ? (
          <p>Loading rooms...</p>
        ) : (
          <div>
            {rooms.length === 0 ? (
              <p>No rooms found.</p>
            ) : (
              <div className="rooms-grid">
                {rooms.map((room) => (
                  <div key={room._id} className="room-card">
                    <h3>{room.name}</h3>
                    <p><strong>Type:</strong> {room.type}</p>
                    <p><strong>Capacity:</strong> {room.capacity}</p>
                    <p><strong>Available:</strong> {room.available ? 'Yes' : 'No'}</p>
                    <div style={{ marginTop: '15px' }}>
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="btn btn-secondary"
                        style={{ marginRight: '10px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* All Bookings Section */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h2>All Bookings</h2>
        {bookingsLoading ? (
          <p>Loading bookings...</p>
        ) : (
          <div>
            {bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <div style={{ marginTop: '20px' }}>
                {bookings.map((booking) => (
                  <div key={booking._id} className="card" style={{ marginBottom: '15px' }}>
                    <h3>{booking.roomId?.name || 'Room'}</h3>
                    <p><strong>User:</strong> {booking.userId?.name} ({booking.userId?.email})</p>
                    <p><strong>Date:</strong> {booking.date}</p>
                    <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                    <p><strong>Purpose:</strong> {booking.purpose}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
