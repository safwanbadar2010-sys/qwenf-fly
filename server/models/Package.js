const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: String,
  destination: {
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  duration: {
    days: {
      type: Number,
      required: true
    },
    nights: {
      type: Number,
      required: true
    }
  },
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    activities: [String],
    meals: [{
      type: String,
      enum: ['breakfast', 'lunch', 'dinner']
    }],
    accommodation: {
      hotel: String,
      type: String
    },
    transport: String
  }],
  inclusions: [{
    type: String,
    enum: [
      'accommodation', 'meals', 'transport', 'sightseeing', 'guide',
      'entrance_fees', 'insurance', 'airport_transfer', 'visa_assistance'
    ]
  }],
  exclusions: [String],
  pricing: {
    adult: {
      basePrice: {
        type: Number,
        required: true
      },
      taxes: Number,
      fees: Number,
      total: Number
    },
    child: {
      basePrice: Number,
      taxes: Number,
      fees: Number,
      total: Number
    },
    infant: {
      basePrice: Number,
      taxes: Number,
      fees: Number,
      total: Number
    },
    singleSupplement: Number,
    groupDiscount: {
      minPeople: Number,
      discountPercent: Number
    }
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  category: {
    type: String,
    required: true,
    enum: [
      'adventure', 'cultural', 'beach', 'mountain', 'city', 'wildlife',
      'religious', 'honeymoon', 'family', 'luxury', 'budget', 'group'
    ]
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme'],
    default: 'easy'
  },
  groupSize: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    }
  },
  ageRestrictions: {
    minAge: Number,
    maxAge: Number
  },
  bestTimeToVisit: [String],
  weather: {
    temperature: {
      min: Number,
      max: Number
    },
    season: String
  },
  requirements: [String],
  cancellationPolicy: {
    freeCancellation: {
      type: Boolean,
      default: false
    },
    cancellationDeadline: Number, // days before departure
    refundPercentage: Number
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
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
packageSchema.index({ name: 'text', description: 'text' });
packageSchema.index({ 'destination.city': 1, 'destination.country': 1 });
packageSchema.index({ category: 1 });
packageSchema.index({ 'pricing.adult.total': 1 });
packageSchema.index({ averageRating: -1 });
packageSchema.index({ isFeatured: 1, isActive: 1 });

module.exports = mongoose.model('Package', packageSchema);
