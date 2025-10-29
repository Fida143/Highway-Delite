const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  refId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  experience: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Experience',
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  qty: { 
    type: Number, 
    required: true,
    min: 1 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  subtotal: { 
    type: Number, 
    required: true 
  },
  taxes: { 
    type: Number, 
    required: true 
  },
  total: { 
    type: Number, 
    required: true 
  },
  promo: { 
    code: String, 
    discount: Number 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
