const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['brand', 'influencer'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const extractedInfoSchema = new mongoose.Schema({
  industry: String,
  deliverables: [String],
  timeline: String,
  specialRequirements: [String]
});

const leadSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    trim: true
  },
  brandLogo: {
    type: String,
    trim: true
  },
  collaborationType: {
    type: String,
    required: true,
    trim: true
  },
  budgetRange: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'qualified', 'negotiating', 'accepted', 'rejected'],
    default: 'new'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  aiConfidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  messages: [messageSchema],
  extractedInfo: extractedInfoSchema,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      if (ret.messages) {
        ret.messages = ret.messages.map(msg => ({
          ...msg,
          _id: msg._id.toString()
        }));
      }
      return ret;
    }
  }
});

// Update lastActivity when status changes
leadSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.lastActivity = new Date();
  }
  next();
});

module.exports = mongoose.model('Lead', leadSchema);