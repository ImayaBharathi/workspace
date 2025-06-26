const User = require('../models/User.js');

class InfluencerService {
  static async createOrUpdateProfile(userId, profileData) {
    console.log(`Creating/updating influencer profile for user: ${userId}`);
    
    try {
      const { name, bio, niche, followerCount, location, rates, instagramHandle } = profileData;
      
      // Validate required fields
      if (!niche || niche.trim() === '') {
        throw new Error('Niche is required');
      }
      
      if (followerCount < 0) {
        throw new Error('Follower count cannot be negative');
      }
      
      // Validate rates
      if (rates) {
        const rateFields = ['sponsoredPost', 'storyPost', 'reelPost', 'productReview', 'longTermPartnership'];
        for (const field of rateFields) {
          if (rates[field] && rates[field] < 0) {
            throw new Error(`${field} rate cannot be negative`);
          }
        }
      }

      const updateData = {
        'influencerProfile.name': name || '',
        'influencerProfile.bio': bio || '',
        'influencerProfile.niche': niche,
        'influencerProfile.followerCount': followerCount || 0,
        'influencerProfile.location': location || '',
        'influencerProfile.instagramHandle': instagramHandle || '',
        'influencerProfile.isProfileComplete': true,
      };

      // Add rates if provided
      if (rates) {
        updateData['influencerProfile.rates.sponsoredPost'] = rates.sponsoredPost || 0;
        updateData['influencerProfile.rates.storyPost'] = rates.storyPost || 0;
        updateData['influencerProfile.rates.reelPost'] = rates.reelPost || 0;
        updateData['influencerProfile.rates.productReview'] = rates.productReview || 0;
        updateData['influencerProfile.rates.longTermPartnership'] = rates.longTermPartnership || 0;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      console.log(`Successfully updated influencer profile for user: ${userId}`);
      return user;
    } catch (err) {
      console.error(`Error creating/updating influencer profile: ${err.message}`);
      throw new Error(`Failed to create/update influencer profile: ${err.message}`);
    }
  }

  static async getProfile(userId) {
    console.log(`Fetching influencer profile for user: ${userId}`);
    
    try {
      const user = await User.findById(userId).select('influencerProfile email');
      
      if (!user) {
        throw new Error('User not found');
      }

      console.log(`Successfully fetched influencer profile for user: ${userId}`);
      return user;
    } catch (err) {
      console.error(`Error fetching influencer profile: ${err.message}`);
      throw new Error(`Failed to fetch influencer profile: ${err.message}`);
    }
  }

  static async getAllProfiles() {
    console.log('Fetching all influencer profiles');
    
    try {
      const users = await User.find({ 'influencerProfile.isProfileComplete': true })
        .select('influencerProfile email')
        .sort({ 'influencerProfile.followerCount': -1 });

      console.log(`Successfully fetched ${users.length} influencer profiles`);
      return users;
    } catch (err) {
      console.error(`Error fetching influencer profiles: ${err.message}`);
      throw new Error(`Failed to fetch influencer profiles: ${err.message}`);
    }
  }
}

module.exports = InfluencerService;