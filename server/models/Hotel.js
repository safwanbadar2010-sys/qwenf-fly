const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: String,
    country: {
      type: String,
      required: true
    },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'pool', 'gym', 'spa', 'restaurant', 'bar', 'room_service',
      'concierge', 'parking', 'airport_shuttle', 'business_center',
      'laundry', 'pet_friendly', 'beach_access', 'mountain_view',
      'city_view', 'garden', 'terrace', 'balcony'
    ]
  }],
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  rooms: [{
    type: {
      type: String,
      required: true,
      enum: ['single', 'double', 'twin', 'triple', 'quad', 'suite', 'family']
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    maxOccupancy: {
      type: Number,
      required: true
    },
    size: Number, // in square meters
    bedType: {
      type: String,
      enum: ['single', 'double', 'queen', 'king', 'twin', 'bunk']
    },
    amenities: [{
      type: String,
      enum: [
        'wifi', 'tv', 'minibar', 'safe', 'balcony', 'ocean_view',
        'mountain_view', 'city_view', 'air_conditioning', 'heating',
        'room_service', 'housekeeping', 'laundry'
      ]
    }],
    pricing: {
      basePrice: {
        type: Number,
        required: true
      },
      taxes: Number,
      fees: Number,
      total: Number
    },
    availability: [{
      date: Date,
      available: Number,
      price: Number
    }],
    images: [String]
  }],
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String,
    children: String,
    pets: String,
    smoking: String
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
hotelSchema.index({ name: 'text', description: 'text', 'address.city': 'text' });
hotelSchema.index({ 'address.city': 1, 'address.country': 1 });
hotelSchema.index({ starRating: 1 });
hotelSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Hotel', hotelSchema);
