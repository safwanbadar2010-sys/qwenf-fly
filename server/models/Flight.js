const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true
  },
  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airline',
    required: true
  },
  aircraft: {
    type: String,
    required: true
  },
  departure: {
    airport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Airport',
      required: true
    },
    terminal: String,
    gate: String,
    scheduledTime: {
      type: Date,
      required: true
    },
    actualTime: Date,
    status: {
      type: String,
      enum: ['on-time', 'delayed', 'cancelled', 'boarding', 'departed'],
      default: 'on-time'
    }
  },
  arrival: {
    airport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Airport',
      required: true
    },
    terminal: String,
    gate: String,
    scheduledTime: {
      type: Date,
      required: true
    },
    actualTime: Date,
    status: {
      type: String,
      enum: ['on-time', 'delayed', 'cancelled', 'arrived'],
      default: 'on-time'
    }
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  distance: {
    type: Number, // in kilometers
    required: true
  },
  stops: [{
    airport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Airport'
    },
    arrivalTime: Date,
    departureTime: Date,
    duration: Number
  }],
  pricing: {
    economy: {
      basePrice: {
        type: Number,
        required: true
      },
      taxes: Number,
      fees: Number,
      total: Number
    },
    business: {
      basePrice: Number,
      taxes: Number,
      fees: Number,
      total: Number
    },
    first: {
      basePrice: Number,
      taxes: Number,
      fees: Number,
      total: Number
    }
  },
  seats: {
    economy: {
      total: Number,
      available: Number,
      layout: String
    },
    business: {
      total: Number,
      available: Number,
      layout: String
    },
    first: {
      total: Number,
      available: Number,
      layout: String
    }
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'entertainment', 'meals', 'drinks', 'blankets', 'pillows', 'power_outlets']
  }],
  baggage: {
    carryOn: {
      weight: Number,
      dimensions: String
    },
    checked: {
      weight: Number,
      price: Number
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
flightSchema.index({ 'departure.airport': 1, 'arrival.airport': 1, 'departure.scheduledTime': 1 });
flightSchema.index({ flightNumber: 1, 'departure.scheduledTime': 1 });
flightSchema.index({ airline: 1, 'departure.scheduledTime': 1 });

module.exports = mongoose.model('Flight', flightSchema);
