/**
 * Dashboard Page Component
 * 
 * Main page after login - shows overview and quick actions
 */

import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ user }) {
  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}! 👋</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Manage your room and lab bookings from here.
      </p>

      <div className="dashboard-cards">
        <div className="card">
          <h3>📚 View Rooms & Labs</h3>
          <p>Browse available classrooms and labs</p>
          <Link to="/rooms" className="btn btn-primary">
            Browse Rooms
          </Link>
        </div>

        <div className="card">
          <h3>📅 My Bookings</h3>
          <p>View and manage your bookings</p>
          <Link to="/my-bookings" className="btn btn-primary">
            View Bookings
          </Link>
        </div>

        {user.role === 'admin' && (
          <div className="card">
            <h3>⚙️ Admin Panel</h3>
            <p>Manage rooms, users, and bookings</p>
            <Link to="/admin" className="btn btn-primary">
              Go to Admin Panel
            </Link>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Quick Info</h3>
        <p><strong>Your Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

export default Dashboard;
