const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['flight', 'hotel', 'cab', 'package']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending'
  },
  // Flight booking details
  flight: {
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight'
    },
    passengers: [{
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
      gender: String,
      passportNumber: String,
      nationality: String,
      seatPreference: String,
      mealPreference: String
    }],
    seats: [{
      seatNumber: String,
      class: String,
      price: Number
    }],
    baggage: {
      carryOn: Number,
      checked: Number
    }
  },
  // Hotel booking details
  hotel: {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel'
    },
    roomType: String,
    rooms: Number,
    guests: {
      adults: Number,
      children: Number,
      infants: Number
    },
    checkIn: Date,
    checkOut: Date,
    specialRequests: String
  },
  // Cab booking details
  cab: {
    cab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cab'
    },
    pickup: {
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      datetime: Date
    },
    dropoff: {
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    passengers: Number,
    luggage: Number,
    specialRequests: String
  },
  // Package booking details
  package: {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package'
    },
    travelers: [{
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
      gender: String,
      passportNumber: String,
      nationality: String,
      type: {
        type: String,
        enum: ['adult', 'child', 'infant']
      }
    }],
    departureDate: Date,
    returnDate: Date,
    specialRequests: String
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    taxes: {
      type: Number,
      default: 0
    },
    fees: {
      type: Number,
      default: 0
    },
    discounts: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentIntentId: String,
    paidAt: Date
  },
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: Date,
    cancelledBy: {
      type: String,
      enum: ['user', 'admin', 'system']
    },
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'completed', 'failed']
    },
    refundReason: String
  },
  notes: String,
  documents: [{
    name: String,
    url: String,
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for efficient searching
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ type: 1, status: 1 });
bookingSchema.index({ 'payment.status': 1 });

// Generate booking ID before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const prefix = this.type.toUpperCase().substring(0, 2);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingId = `${prefix}${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
