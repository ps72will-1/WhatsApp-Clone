// server/routes/config.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @desc    Get app configuration
// @route   GET /api/config
// @access  Public
router.get('/', (req, res) => {
  try {
    // Return app configuration from environment variables
    res.json({
      appName: process.env.APP_NAME || 'ChatConnect',
      logoPath: process.env.APP_LOGO_PATH || '/img/logo.png'
    });
  } catch (error) {
    console.error('Config error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update app configuration (for admin)
// @route   PUT /api/config
// @access  Private/Admin (would need admin middleware in a real app)
router.put('/', auth, (req, res) => {
  try {
    // This would typically update configuration in a database
    // For this demo, we'll just return the current config
    res.json({
      appName: process.env.APP_NAME || 'ChatConnect',
      logoPath: process.env.APP_LOGO_PATH || '/img/logo.png'
    });
  } catch (error) {
    console.error('Config update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;