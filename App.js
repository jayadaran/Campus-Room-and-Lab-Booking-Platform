/**
 * Main App Component
 * 
 * This is the root component that handles routing
 * React Router is used to navigate between different pages
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';

// Import page components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import BookRoom from './pages/BookRoom';
import MyBookings from './pages/MyBookings';
import AdminPanel from './pages/AdminPanel';

// Import layout component
import Navbar from './components/Navbar';

function App() {
  // State to track if user is logged in and user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app loads
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated
   * Gets token from localStorage and verifies it with backend
   */
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Verify token and get user data
        const userData = await authAPI.getMe();
        setUser(userData);
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    
    setLoading(false);
  };

  /**
   * Handle login
   * Saves token and user data
   */
  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  /**
   * Handle logout
   * Removes token and clears user data
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Show loading message while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {/* Show navbar if user is logged in */}
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <div className="container">
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
              }
            />
            <Route
              path="/register"
              element={
                user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />
              }
            />

            {/* Protected routes (require login) */}
            <Route
              path="/dashboard"
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/rooms"
              element={user ? <Rooms user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/book/:roomId"
              element={user ? <BookRoom user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-bookings"
              element={user ? <MyBookings user={user} /> : <Navigate to="/login" />}
            />

            {/* Admin only route */}
            <Route
              path="/admin"
              element={
                user && user.role === 'admin' ? (
                  <AdminPanel user={user} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />

            {/* Default route - redirect to dashboard or login */}
            <Route
              path="/"
              element={<Navigate to={user ? '/dashboard' : '/login'} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
