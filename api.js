/**
 * API Service
 * 
 * This file handles all HTTP requests to the backend
 * It uses axios to make API calls and includes authentication tokens
 */

import axios from 'axios';

// Base URL for the backend API
// Change this if your backend runs on a different port
const API_URL = 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add token to requests if user is logged in
 * This runs before every request
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (where we store it after login)
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Authentication API calls
 */
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get current user info
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

/**
 * Rooms API calls
 */
export const roomsAPI = {
  // Get all rooms
  getAll: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },

  // Get single room by ID
  getById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  // Create room (admin only)
  create: async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },

  // Update room (admin only)
  update: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  // Delete room (admin only)
  delete: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
};

/**
 * Bookings API calls
 */
export const bookingsAPI = {
  // Get current user's bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Get all bookings (admin only)
  getAll: async () => {
    const response = await api.get('/bookings/all');
    return response.data;
  },

  // Create a new booking
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Cancel a booking
  cancel: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

export default api;
