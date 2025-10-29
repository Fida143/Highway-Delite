const express = require('express');
const router = express.Router();
const Promo = require('../models/Promo');

// POST /api/promo/validate - Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Promo code is required' });
    }

    const promo = await Promo.findOne({ code: code.toUpperCase() });
    
    if (!promo) {
      return res.json({ valid: false, message: 'Invalid promo code' });
    }

    // Check if promo has expired
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.json({ valid: false, message: 'Promo code has expired' });
    }

    res.json({ 
      valid: true, 
      promo: {
        code: promo.code,
        type: promo.type,
        value: promo.value
      }
    });
  } catch (error) {
    console.error('Error validating promo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
