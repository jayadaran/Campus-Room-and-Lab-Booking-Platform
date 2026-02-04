/**
 * Rooms Page Component
 * 
 * Displays all available rooms and labs
 * Users can click on a room to book it
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomsAPI } from '../services/api';

function Rooms({ user }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, classroom, lab

  /**
   * Fetch rooms from API when component loads
   */
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await roomsAPI.getAll();
      setRooms(data);
    } catch (error) {
      setError('Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms based on selected filter
  const filteredRooms = rooms.filter((room) => {
    if (filter === 'all') return true;
    return room.type === filter;
  });

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="rooms-page">
      <h1>Rooms & Labs</h1>
      <p>Browse and book available classrooms and labs.</p>

      {/* Filter buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
          style={{ marginRight: '10px' }}
        >
          All
        </button>
        <button
          className={`btn ${filter === 'classroom' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('classroom')}
          style={{ marginRight: '10px' }}
        >
          Classrooms
        </button>
        <button
          className={`btn ${filter === 'lab' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('lab')}
        >
          Labs
        </button>
      </div>

      {/* Rooms grid */}
      {filteredRooms.length === 0 ? (
        <div className="card">
          <p>No rooms found.</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {filteredRooms.map((room) => (
            <div key={room._id} className="room-card">
              <h3>{room.name}</h3>
              <div style={{ marginBottom: '10px' }}>
                <span className={`badge badge-${room.type}`}>
                  {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                </span>
                {!room.available && (
                  <span className="badge badge-unavailable">Unavailable</span>
                )}
              </div>
              <p><strong>Capacity:</strong> {room.capacity} people</p>
              {room.facilities && room.facilities.length > 0 && (
                <p><strong>Facilities:</strong> {room.facilities.join(', ')}</p>
              )}
              {room.description && <p>{room.description}</p>}
              <Link
                to={`/book/${room._id}`}
                className={`btn ${room.available ? 'btn-primary' : 'btn-secondary'}`}
                style={{ marginTop: '15px', display: 'inline-block' }}
                onClick={(e) => {
                  if (!room.available) {
                    e.preventDefault();
                    alert('This room is currently unavailable for booking.');
                  }
                }}
              >
                {room.available ? 'Book Now' : 'Unavailable'}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rooms;
