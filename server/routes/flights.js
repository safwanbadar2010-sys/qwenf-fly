const express = require('express');
const { body, validationResult } = require('express-validator');
const Flight = require('../models/Flight');
const Airport = require('../models/Airport');
const Airline = require('../models/Airline');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/flights/airports
// @desc    Search airports
// @access  Public
router.get('/airports', async (req, res) => {
  try {
    const { search, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { iataCode: { $regex: search, $options: 'i' } }
      ];
    }

    const airports = await Airport.find(query)
      .select('iataCode name city country countryCode')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: airports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/flights/search
// @desc    Search flights
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const {
      from,
      to,
      departureDate,
      returnDate,
      passengers = 1,
      class: flightClass = 'economy',
      sortBy = 'price'
    } = req.query;

    if (!from || !to || !departureDate) {
      return res.status(400).json({ 
        message: 'From, to, and departure date are required' 
      });
    }

    // Find airports
    const fromAirport = await Airport.findOne({ 
      $or: [{ iataCode: from }, { city: { $regex: from, $options: 'i' } }] 
    });
    const toAirport = await Airport.findOne({ 
      $or: [{ iataCode: to }, { city: { $regex: to, $options: 'i' } }] 
    });

    if (!fromAirport || !toAirport) {
      return res.status(400).json({ message: 'Invalid airport codes' });
    }

    const startDate = new Date(departureDate);
    const endDate = new Date(departureDate);
    endDate.setDate(endDate.getDate() + 1);

    let query = {
      'departure.airport': fromAirport._id,
      'arrival.airport': toAirport._id,
      'departure.scheduledTime': {
        $gte: startDate,
        $lt: endDate
      },
      isActive: true
    };

    // Add return flights if return date is provided
    let returnQuery = null;
    if (returnDate) {
      const returnStartDate = new Date(returnDate);
      const returnEndDate = new Date(returnDate);
      returnEndDate.setDate(returnEndDate.getDate() + 1);

      returnQuery = {
        'departure.airport': toAirport._id,
        'arrival.airport': fromAirport._id,
        'departure.scheduledTime': {
          $gte: returnStartDate,
          $lt: returnEndDate
        },
        isActive: true
      };
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price':
        sort = { [`pricing.${flightClass}.total`]: 1 };
        break;
      case 'duration':
        sort = { duration: 1 };
        break;
      case 'departure':
        sort = { 'departure.scheduledTime': 1 };
        break;
      default:
        sort = { [`pricing.${flightClass}.total`]: 1 };
    }

    const flights = await Flight.find(query)
      .populate('airline', 'name iataCode logo')
      .populate('departure.airport', 'iataCode name city')
      .populate('arrival.airport', 'iataCode name city')
      .sort(sort);

    let returnFlights = [];
    if (returnQuery) {
      returnFlights = await Flight.find(returnQuery)
        .populate('airline', 'name iataCode logo')
        .populate('departure.airport', 'iataCode name city')
        .populate('arrival.airport', 'iataCode name city')
        .sort(sort);
    }

    res.json({
      success: true,
      data: {
        outbound: flights,
        return: returnFlights,
        searchParams: {
          from: fromAirport,
          to: toAirport,
          departureDate,
          returnDate,
          passengers: parseInt(passengers),
          class: flightClass
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/flights/:id
// @desc    Get flight details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id)
      .populate('airline', 'name iataCode logo website')
      .populate('departure.airport', 'iataCode name city country terminal')
      .populate('arrival.airport', 'iataCode name city country terminal');

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.json({
      success: true,
      data: flight
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/flights/book
// @desc    Book a flight
// @access  Private
router.post('/book', auth, [
  body('flightId').notEmpty().withMessage('Flight ID is required'),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required'),
  body('passengers.*.firstName').notEmpty().withMessage('First name is required'),
  body('passengers.*.lastName').notEmpty().withMessage('Last name is required'),
  body('passengers.*.dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('passengers.*.gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { flightId, passengers, seats, baggage, specialRequests } = req.body;

    // Get flight details
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Check availability
    if (flight.seats.economy.available < passengers.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Calculate pricing
    const basePrice = flight.pricing.economy.basePrice;
    const taxes = flight.pricing.economy.taxes || 0;
    const fees = flight.pricing.economy.fees || 0;
    const totalPrice = (basePrice + taxes + fees) * passengers.length;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      type: 'flight',
      flight: {
        flight: flightId,
        passengers,
        seats: seats || [],
        baggage: baggage || { carryOn: 1, checked: 0 }
      },
      pricing: {
        basePrice: basePrice * passengers.length,
        taxes: taxes * passengers.length,
        fees: fees * passengers.length,
        total: totalPrice
      },
      notes: specialRequests
    });

    await booking.save();

    // Update flight availability
    flight.seats.economy.available -= passengers.length;
    await flight.save();

    res.status(201).json({
      success: true,
      message: 'Flight booked successfully',
      data: {
        bookingId: booking.bookingId,
        booking: booking
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/flights/airlines
// @desc    Get all airlines
// @access  Public
router.get('/airlines', async (req, res) => {
  try {
    const airlines = await Airline.find({ isActive: true })
      .select('name iataCode icaoCode logo country alliance');

    res.json({
      success: true,
      data: airlines
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/flights/popular-routes
// @desc    Get popular flight routes
// @access  Public
router.get('/popular-routes', async (req, res) => {
  try {
    // This would typically come from analytics data
    const popularRoutes = [
      {
        from: { iataCode: 'NYC', city: 'New York', country: 'USA' },
        to: { iataCode: 'LAX', city: 'Los Angeles', country: 'USA' },
        price: 299,
        duration: '5h 30m'
      },
      {
        from: { iataCode: 'LHR', city: 'London', country: 'UK' },
        to: { iataCode: 'CDG', city: 'Paris', country: 'France' },
        price: 199,
        duration: '1h 15m'
      },
      {
        from: { iataCode: 'DXB', city: 'Dubai', country: 'UAE' },
        to: { iataCode: 'BOM', city: 'Mumbai', country: 'India' },
        price: 399,
        duration: '3h 15m'
      }
    ];

    res.json({
      success: true,
      data: popularRoutes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
