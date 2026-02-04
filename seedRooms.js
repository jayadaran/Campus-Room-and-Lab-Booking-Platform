/**
 * Database Seeding Script
 * 
 * This script adds sample rooms and labs to the database
 * Run this with: node seedRooms.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');

// Sample rooms and labs data
const sampleRooms = [
  // Classrooms
  {
    name: 'Classroom A-101',
    type: 'classroom',
    capacity: 40,
    facilities: ['projector', 'whiteboard', 'sound system'],
    description: 'Large classroom with modern AV equipment',
    available: true,
  },
  {
    name: 'Classroom A-102',
    type: 'classroom',
    capacity: 30,
    facilities: ['projector', 'whiteboard'],
    description: 'Medium-sized classroom',
    available: true,
  },
  {
    name: 'Classroom B-201',
    type: 'classroom',
    capacity: 50,
    facilities: ['projector', 'whiteboard', 'computers', 'sound system'],
    description: 'Large lecture hall with computer stations',
    available: true,
  },
  {
    name: 'Classroom C-301',
    type: 'classroom',
    capacity: 25,
    facilities: ['projector', 'whiteboard'],
    description: 'Small classroom for seminars',
    available: true,
  },
  
  // Labs
  {
    name: 'Computer Lab 1',
    type: 'lab',
    capacity: 30,
    facilities: ['computers', 'projector', 'network access'],
    description: 'Computer lab with 30 workstations',
    available: true,
  },
  {
    name: 'Computer Lab 2',
    type: 'lab',
    capacity: 25,
    facilities: ['computers', 'projector', 'network access', '3D printers'],
    description: 'Advanced computer lab with 3D printing facilities',
    available: true,
  },
  {
    name: 'Chemistry Lab',
    type: 'lab',
    capacity: 20,
    facilities: ['lab equipment', 'safety equipment', 'fume hoods'],
    description: 'Fully equipped chemistry laboratory',
    available: true,
  },
  {
    name: 'Physics Lab',
    type: 'lab',
    capacity: 24,
    facilities: ['lab equipment', 'projector', 'measurement tools'],
    description: 'Physics laboratory with modern equipment',
    available: true,
  },
  {
    name: 'Engineering Lab',
    type: 'lab',
    capacity: 18,
    facilities: ['3D printers', 'CNC machines', 'tools', 'computers'],
    description: 'Engineering lab with prototyping equipment',
    available: true,
  },
];

/**
 * Connect to database and seed rooms
 */
async function seedRooms() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing rooms (optional - comment out if you want to keep existing rooms)
    // await Room.deleteMany({});
    // console.log('🗑️  Cleared existing rooms');

    // Check if rooms already exist
    const existingRooms = await Room.find({});
    if (existingRooms.length > 0) {
      console.log(`\n⚠️  Found ${existingRooms.length} existing room(s) in database.`);
      console.log('   Adding new rooms (duplicates will be skipped)...\n');
    }

    // Insert sample rooms
    let addedCount = 0;
    let skippedCount = 0;

    for (const roomData of sampleRooms) {
      try {
        // Check if room with same name already exists
        const existingRoom = await Room.findOne({ name: roomData.name });
        
        if (existingRoom) {
          console.log(`⏭️  Skipped: ${roomData.name} (already exists)`);
          skippedCount++;
        } else {
          const room = await Room.create(roomData);
          console.log(`✅ Added: ${room.name} (${room.type}, capacity: ${room.capacity})`);
          addedCount++;
        }
      } catch (error) {
        console.error(`❌ Error adding ${roomData.name}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Added: ${addedCount} room(s)`);
    console.log(`   ⏭️  Skipped: ${skippedCount} room(s)`);
    console.log(`   📦 Total in database: ${(await Room.find({})).length} room(s)`);

    // Close database connection
    await mongoose.connection.close();
    console.log('\n✅ Seeding completed! Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedRooms();
