const mongoose = require('mongoose');

const { validatePassword, isPasswordHash } = require('../utils/password.js');
const {randomUUID} = require("crypto");

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    validate: { validator: isPasswordHash, message: 'Invalid password hash' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  refreshToken: {
    type: String,
    unique: true,
    index: true,
    default: () => randomUUID(),
  },
  // Influencer-specific fields
  influencerProfile: {
    name: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    niche: {
      type: String,
      default: '',
    },
    followerCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      type: String,
      default: '',
    },
    rates: {
      sponsoredPost: {
        type: Number,
        default: 0,
        min: 0,
      },
      storyPost: {
        type: Number,
        default: 0,
        min: 0,
      },
      reelPost: {
        type: Number,
        default: 0,
        min: 0,
      },
      productReview: {
        type: Number,
        default: 0,
        min: 0,
      },
      longTermPartnership: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    instagramHandle: {
      type: String,
      default: '',
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
}, {
  versionKey: false,
});

schema.set('toJSON', {
  /* eslint-disable */
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  },
  /* eslint-enable */
});

const User = mongoose.model('User', schema);

module.exports = User;