const express = require('express');
const InfluencerService = require('../services/influencerService.js');
const { requireUser } = require('./middleware/auth.js');

const router = express.Router();

// Create or update influencer profile
router.post('/profile', requireUser, async (req, res) => {
  try {
    console.log(`Creating/updating influencer profile for user: ${req.user._id}`);
    
    const profileData = req.body;
    const user = await InfluencerService.createOrUpdateProfile(req.user._id, profileData);
    
    res.status(200).json({
      success: true,
      message: 'Influencer profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error(`Error in POST /api/influencer-profile: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get current user's influencer profile
router.get('/profile', requireUser, async (req, res) => {
  try {
    console.log(`Fetching influencer profile for user: ${req.user._id}`);
    
    const user = await InfluencerService.getProfile(req.user._id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(`Error in GET /api/influencer-profile: ${error.message}`);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Get influencer profile by ID
router.get('/profile/:id', requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching influencer profile for user: ${id}`);
    
    const user = await InfluencerService.getProfile(id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(`Error in GET /api/influencer-profile/${req.params.id}: ${error.message}`);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Get all influencer profiles (for admin or discovery purposes)
router.get('/profiles', requireUser, async (req, res) => {
  try {
    console.log('Fetching all influencer profiles');
    
    const users = await InfluencerService.getAllProfiles();
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error(`Error in GET /api/influencer-profiles: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;