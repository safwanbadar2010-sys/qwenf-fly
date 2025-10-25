const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    required: true,
    enum: ['sedan', 'suv', 'hatchback', 'luxury', 'minivan', 'bus']
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  color: String,
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    passengers: {
      type: Number,
      required: true
    },
    luggage: {
      type: Number,
      required: true
    }
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'ac', 'music_system', 'gps', 'child_seat',
      'wheelchair_accessible', 'phone_charger', 'water_bottles'
    ]
  }],
  images: [String],
  driver: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: String,
    licenseNumber: {
      type: String,
      required: true
    },
    experience: Number, // in years
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    languages: [String],
    image: String
  },
  pricing: {
    baseRate: {
      type: Number,
      required: true
    },
    perKmRate: {
      type: Number,
      required: true
    },
    perHourRate: {
      type: Number,
      required: true
    },
    minimumFare: {
      type: Number,
      required: true
    },
    surgeMultiplier: {
      type: Number,
      default: 1
    }
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    workingHours: {
      start: String,
      end: String
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  location: {
    current: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    serviceAreas: [{
      city: String,
      state: String,
      country: String,
      radius: Number // in kilometers
    }]
  },
  insurance: {
    policyNumber: String,
    expiryDate: Date,
    coverage: String
  },
  maintenance: {
    lastService: Date,
    nextService: Date,
    mileage: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
cabSchema.index({ vehicleType: 1, 'availability.isAvailable': 1 });
cabSchema.index({ 'location.current': '2dsphere' });
cabSchema.index({ 'driver.rating': -1 });

module.exports = mongoose.model('Cab', cabSchema);
