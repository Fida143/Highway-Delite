const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Experience = require('../models/Experience');
const shortid = require('shortid');

// POST /api/bookings - Create a booking (prevents double-booking)
router.post('/', async (req, res) => {
  try {
    const { experienceId, date, time, qty, name, email, promo } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    if (!experienceId || !date || !time || !qty) {
      return res.status(400).json({ message: 'Experience, date, time, and quantity are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Atomic operation to prevent double-booking
    // Find experience and decrement slot capacity atomically
    const filter = {
      _id: experienceId,
      slots: { 
        $elemMatch: { 
          date, 
          time, 
          capacity: { $gte: qty } 
        } 
      }
    };

    const update = { 
      $inc: { 'slots.$.capacity': -qty } 
    };

    const updatedExp = await Experience.findOneAndUpdate(filter, update, { new: true });
    
    if (!updatedExp) {
      return res.status(409).json({ 
        message: 'Selected slot does not have enough availability (sold out or insufficient capacity)' 
      });
    }

    // Calculate pricing
    const subtotal = updatedExp.price * qty;
    const taxes = Math.round(subtotal * 0.06); // 6% tax
    let total = subtotal + taxes;
    let appliedPromo = null;

    // Apply promo code if valid
    if (promo && promo.code) {
      if (promo.type === 'percentage') {
        const discount = Math.round(subtotal * (promo.value / 100));
        total = Math.max(0, total - discount);
        appliedPromo = { code: promo.code, discount };
      } else {
        total = Math.max(0, total - promo.value);
        appliedPromo = { code: promo.code, discount: promo.value };
      }
    }

    // Create booking
    const booking = new Booking({
      refId: shortid.generate().toUpperCase(),
      experience: experienceId,
      date,
      time,
      qty,
      name,
      email,
      subtotal,
      taxes,
      total,
      promo: appliedPromo
    });

    await booking.save();

    res.json({ 
      success: true, 
      booking: {
        refId: booking.refId,
        total: booking.total,
        experience: updatedExp.title,
        date: booking.date,
        time: booking.time,
        qty: booking.qty
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
