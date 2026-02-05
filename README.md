# 🏫 Campus Room & Lab Booking Platform

A full-stack web application for managing and booking classrooms and laboratories on campus. Built with React, Node.js, Express, and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### For Students & Faculty
- 🔐 **User Authentication** - Secure registration and login with JWT
- 📚 **Browse Rooms & Labs** - View all available classrooms and laboratories
- 📅 **Book Rooms** - Reserve rooms with date, time, and purpose
- 📋 **My Bookings** - View and manage your bookings
- ❌ **Cancel Bookings** - Cancel your bookings anytime
- 🔍 **Filter Rooms** - Filter by type (Classroom/Lab)

### For Administrators
- 👥 **User Management** - View all users and their roles
- 🏢 **Room Management** - Create, update, and delete rooms/labs
- 📊 **View All Bookings** - Monitor all bookings across the platform
- 🔒 **Role-Based Access** - Secure admin-only features

### System Features
- 🚫 **Double Booking Prevention** - Automatic conflict detection
- 🔒 **Password Hashing** - Secure password storage with bcrypt
- 🎯 **Input Validation** - Server-side validation for all inputs
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router 6.20.1** - Client-side routing
- **Axios 1.6.2** - HTTP client for API requests
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express 4.18.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.0.3** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcryptjs 2.4.3** - Password hashing
- **dotenv 16.3.1** - Environment variables
- **CORS 2.8.5** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download Community Edition](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jayadaran/campus-lab-booking.git
   cd campus-lab-booking
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Create `.env` file in the `backend` directory:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/campus-booking
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   ```

   **For MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-booking
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   ```

2. **Update API URL in frontend (if needed)**
   
   Edit `frontend/src/services/api.js` and update the `API_URL` if your backend runs on a different port:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```
   
   The server will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm start
   ```
   
   The app will open automatically at `http://localhost:3000`

### Seeding Sample Data

To add sample rooms and labs to your database:

```bash
cd backend
node seedRooms.js
```

This will add 10 sample rooms (4 classrooms and 6 labs) to your database.

## 📖 Usage

### Creating an Account

1. Navigate to `http://localhost:3000/register`
2. Fill in your details (name, email, password, role)
3. Click "Register"
4. You'll be automatically logged in

### Making Yourself Admin

**Option 1: Using MongoDB Compass**
1. Open MongoDB Compass
2. Connect to your database
3. Go to `users` collection
4. Find your user document
5. Change `role` field to `"admin"`

**Option 2: Using MongoDB Shell**
```javascript
use campus-booking
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Booking a Room

1. Login to your account
2. Go to "Rooms & Labs"
3. Click "Book Now" on any available room
4. Select date, start time, end time, and purpose
5. Click "Confirm Booking"

### Managing Rooms (Admin Only)

1. Login as admin
2. Go to "Admin Panel"
3. Click "+ Add New Room" to create rooms
4. Use "Edit" and "Delete" buttons to manage existing rooms

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "token": "jwt_token_here"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Room Endpoints

#### Get All Rooms
```http
GET /api/rooms
```

#### Get Single Room
```http
GET /api/rooms/:id
```

#### Create Room (Admin Only)
```http
POST /api/rooms
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Lab 101",
  "type": "lab",
  "capacity": 30,
  "facilities": ["computers", "projector"],
  "description": "Computer lab",
  "available": true
}
```

#### Update Room (Admin Only)
```http
PUT /api/rooms/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "capacity": 35,
  "available": false
}
```

#### Delete Room (Admin Only)
```http
DELETE /api/rooms/:id
Authorization: Bearer <admin_token>
```

### Booking Endpoints

#### Get My Bookings
```http
GET /api/bookings
Authorization: Bearer <token>
```

#### Get All Bookings (Admin Only)
```http
GET /api/bookings/all
Authorization: Bearer <admin_token>
```

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "roomId": "room_id",
  "date": "2024-01-15",
  "startTime": "09:00",
  "endTime": "11:00",
  "purpose": "Lab session"
}
```

#### Cancel Booking
```http
DELETE /api/bookings/:id
Authorization: Bearer <token>
```

## 📁 Project Structure

```
campus-lab-booking/
├── backend/                 # Backend API
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/             # Database schemas
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Booking.js
│   ├── routes/             # API routes
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   └── bookingRoutes.js
│   ├── middleware/
│   │   └── auth.js         # Authentication middleware
│   ├── server.js           # Main server file
│   ├── seedRooms.js        # Database seeding script
│   ├── .env                # Environment variables (create this)
│   └── package.json
│
├── frontend/               # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   ├── pages/         # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Rooms.js
│   │   │   ├── BookRoom.js
│   │   │   ├── MyBookings.js
│   │   │   └── AdminPanel.js
│   │   ├── services/
│   │   │   └── api.js      # API service
│   │   ├── App.js          # Main app component
│   │   ├── index.js        # Entry point
│   │   └── index.css       # Global styles
│   └── package.json
│
└── README.md
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  role: String (enum: ['student', 'faculty', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Room Collection
```javascript
{
  _id: ObjectId,
  name: String (unique),
  type: String (enum: ['classroom', 'lab']),
  capacity: Number,
  facilities: [String],
  available: Boolean,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  roomId: ObjectId (ref: 'Room'),
  date: String (YYYY-MM-DD),
  startTime: String (HH:MM),
  endTime: String (HH:MM),
  purpose: String,
  status: String (enum: ['confirmed', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes before submitting
- Update documentation if needed

## 🐛 Known Issues

- None at the moment. If you find any, please open an issue!

## 🔮 Future Enhancements

- [ ] Email notifications for bookings
- [ ] Calendar view for bookings
- [ ] Recurring bookings
- [ ] Room availability calendar
- [ ] Advanced search and filters
- [ ] Booking history and reports
- [ ] Mobile app (React Native)
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 👤 Author

**Your Name**
- GitHub: [@jayadaran](https://github.com/jayadaran)
- Email: kit28.24bam030@gmail.com
