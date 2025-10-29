const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema({
  code: { 
    type: String, 
    unique: true,
    required: true,
    uppercase: true 
  },
  type: { 
    type: String, 
    enum: ['percentage', 'flat'],
    required: true 
  },
  value: { 
    type: Number, 
    required: true,
    min: 0 
  },
  expiresAt: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Promo', PromoSchema);
