const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
  iataCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 3
  },
  icaoCode: {
    type: String,
    uppercase: true,
    length: 4
  },
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true,
    uppercase: true,
    length: 2
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  terminals: [{
    name: String,
    gates: [String]
  }],
  facilities: [{
    type: String,
    enum: ['restaurant', 'shop', 'lounge', 'wifi', 'parking', 'car_rental', 'hotel', 'pharmacy', 'bank', 'atm']
  }],
  airlines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airline'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient searching
airportSchema.index({ iataCode: 1 });
airportSchema.index({ city: 1, country: 1 });
airportSchema.index({ name: 'text', city: 'text', country: 'text' });

module.exports = mongoose.model('Airport', airportSchema);
