const mongoose = require('mongoose');

const airlineSchema = new mongoose.Schema({
  iataCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 2
  },
  icaoCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 3
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  logo: String,
  website: String,
  phone: String,
  email: String,
  headquarters: {
    city: String,
    country: String
  },
  fleet: [{
    aircraft: String,
    count: Number
  }],
  destinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airport'
  }],
  alliance: {
    type: String,
    enum: ['Star Alliance', 'SkyTeam', 'Oneworld', 'None']
  },
  frequentFlyerProgram: {
    name: String,
    website: String
  },
  services: [{
    type: String,
    enum: ['cargo', 'charter', 'scheduled', 'low_cost']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient searching
airlineSchema.index({ iataCode: 1 });
airlineSchema.index({ name: 'text' });

module.exports = mongoose.model('Airline', airlineSchema);
