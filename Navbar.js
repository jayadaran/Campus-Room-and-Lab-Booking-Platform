/**
 * Navigation Bar Component
 * 
 * Displays navigation links and user info
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          🏫 Campus Booking
        </Link>

        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link
            to="/rooms"
            className={location.pathname === '/rooms' ? 'active' : ''}
          >
            Rooms & Labs
          </Link>
          <Link
            to="/my-bookings"
            className={location.pathname === '/my-bookings' ? 'active' : ''}
          >
            My Bookings
          </Link>
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              Admin Panel
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-name">{user.name}</span>
          <span className="user-role">({user.role})</span>
          <button onClick={onLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
