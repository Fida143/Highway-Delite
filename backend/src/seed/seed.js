require('dotenv').config();
const mongoose = require('mongoose');
const Experience = require('../models/Experience');
const Promo = require('../models/Promo');

// Connect to database
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://fidahussain:7563821444FIda@cluster0.dweg55n.mongodb.net/bookit?retryWrites=true&w=majority';
    await mongoose.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Generate dates for the next 30 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Generate time slots
const generateTimeSlots = () => {
  return [
    { time: '07:00', capacity: 4 },
    { time: '09:00', capacity: 2 },
    { time: '11:00', capacity: 5 },
    { time: '13:00', capacity: 3 }, // was 0 (always sold out)
    { time: '15:00', capacity: 3 },
    { time: '17:00', capacity: 2 }
  ];
};

// Generate slots for all dates
const generateSlots = () => {
  const dates = generateDates();
  const timeSlots = generateTimeSlots();
  const slots = [];
  
  dates.forEach(date => {
    timeSlots.forEach(timeSlot => {
      slots.push({
        date,
        time: timeSlot.time,
        capacity: timeSlot.capacity
      });
    });
  });
  
  return slots;
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Experience.deleteMany({});
    await Promo.deleteMany({});

    console.log('Cleared existing data');

    // Create experiences
    const experiences = [
      {
        title: 'Kayaking',
        slug: 'kayaking-udupi',
        price: 999,
        location: 'Udupi',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
        slots: generateSlots()
      },
      {
        title: 'Nandi Hills Sunrise',
        slug: 'nandi-hills-sunrise',
        price: 899,
        location: 'Bangalore',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Experience the breathtaking sunrise from Nandi Hills with panoramic views.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
        slots: generateSlots()
      },
      {
        title: 'Coffee Trail',
        slug: 'coffee-trail-coorg',
        price: 1299,
        location: 'Coorg',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Explore the aromatic coffee plantations and learn about coffee cultivation.',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop',
        slots: generateSlots()
      },
      {
        title: 'Boat Cruise',
        slug: 'boat-cruise-sunderban',
        price: 1599,
        location: 'Sunderban',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Cruise through the mangrove forests and spot wildlife.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
        slots: generateSlots()
      },
      {
        title: 'Bunjee Jumping',
        slug: 'bunjee-jumping-manali',
        price: 2499,
        location: 'Manali',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Experience the ultimate adrenaline rush with professional bunjee jumping.',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop',
        slots: generateSlots()
      },
      {
        title: 'Trekking Adventure',
        slug: 'trekking-adventure-himachal',
        price: 1899,
        location: 'Himachal Pradesh',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Explore scenic mountain trails and enjoy nature at its best.',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&h=300&fit=crop',
        slots: generateSlots()
      },
      {
        title: 'Wildlife Safari',
        slug: 'wildlife-safari-ranthambore',
        price: 2199,
        location: 'Ranthambore',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Spot tigers and other wildlife in their natural habitat.',
        image: 'https://images.unsplash.com/photo-1544966503-7cc4ac81b4a4?w=500&h=300&fit=crop',
        slots: generateSlots()
      },
      {
        title: 'Desert Camping',
        slug: 'desert-camping-rajasthan',
        price: 1799,
        location: 'Rajasthan',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Experience the magic of desert nights under the stars.',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&h=300&fit=crop',
        slots: generateSlots()
      }
    ];

    // Create promo codes
    const promos = [
      {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        code: 'FLAT100',
        type: 'flat',
        value: 100,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
      },
      {
        code: 'WELCOME20',
        type: 'percentage',
        value: 20,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    ];

    // Insert data
    await Experience.insertMany(experiences);
    await Promo.insertMany(promos);

    console.log('✅ Seed data created successfully!');
    console.log(`Created ${experiences.length} experiences`);
    console.log(`Created ${promos.length} promo codes`);
    console.log('Available promo codes: SAVE10, FLAT100, WELCOME20');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedData();
