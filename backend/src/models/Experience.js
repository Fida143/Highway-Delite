const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true 
  }, // ISO date string e.g. 2025-10-22
  time: { 
    type: String, 
    required: true 
  }, // e.g. '09:00'
  capacity: { 
    type: Number, 
    required: true,
    min: 0 
  }
});

const ExperienceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    required: true,
    unique: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  location: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  slots: [SlotSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Experience', ExperienceSchema);
