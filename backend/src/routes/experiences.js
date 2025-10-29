const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');

// GET /api/experiences - List all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find({});
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/experiences/:id - Get experience details
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
