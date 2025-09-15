const { Router } = require('express');
const { sequelize } = require('../models');

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    
    res.status(200).json({
      success: true,
      message: 'API is healthy',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
