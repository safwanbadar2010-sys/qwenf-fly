const express = require('express');
const { body, validationResult } = require('express-validator');
const Flight = require('../models/Flight');
const Airport = require('../models/Airport');
const Airline = require('../models/Airline');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');
const flightApiService = require('../services/flightApiService');

const router = express.Router();

// @route   GET /api/flights/multi-city
// @desc    Search multi-city flights
// @access  Public
router.get('/multi-city', async (req, res) => {
  try {
    const {
      airports, // comma-separated airport codes
      dates, // comma-separated dates
      adults = 1,
      children = 0,
      infants = 0,
      class: flightClass = 'Economy',
      currency = 'USD'
    } = req.query;

    if (!airports || !dates) {
      return res.status(400).json({ 
        message: 'Airports and dates are required for multi-city search' 
      });
    }

    const airportList = airports.split(',').map(a => a.trim().toUpperCase());
    const dateList = dates.split(',').map(d => d.trim());

    if (airportList.length < 2 || dateList.length < 1) {
      return res.status(400).json({ 
        message: 'At least 2 airports and 1 date are required' 
      });
    }

    const flightResults = await flightApiService.searchMultiCity({
      airports: airportList,
      dates: dateList,
      adults: parseInt(adults),
      children: parseInt(children),
      infants: parseInt(infants),
      cabinClass: flightClass,
      currency
    });

    res.json({
      success: true,
      data: {
        flights: flightResults.flights || [],
        searchParams: {
          airports: airportList,
          dates: dateList,
          adults: parseInt(adults),
          children: parseInt(children),
          infants: parseInt(infants),
          class: flightClass,
          currency
        },
        metadata: flightResults.metadata
      }
    });
  } catch (error) {
    console.error('Multi-city search error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error searching multi-city flights'
    });
  }
});

// @route   GET /api/flights/track
// @desc    Track flights by route
// @access  Public
router.get('/track', async (req, res) => {
  try {
    const { date, airport1, airport2 } = req.query;

    if (!date || !airport1 || !airport2) {
      return res.status(400).json({ 
        message: 'Date, airport1, and airport2 are required' 
      });
    }

    // Format date as YYYYMMDD
    const formatDateForTracking = (dateStr) => {
      const d = new Date(dateStr);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const trackingData = await flightApiService.trackByRoute({
      date: formatDateForTracking(date),
      airport1: airport1.toUpperCase(),
      airport2: airport2.toUpperCase()
    });

    res.json({
      success: true,
      data: trackingData
    });
  } catch (error) {
    console.error('Flight tracking error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error tracking flights'
    });
  }
});

// @route   GET /api/flights/airline-info
// @desc    Get airline flight information
// @access  Public
router.get('/airline-info', async (req, res) => {
  try {
    const { flightNumber, airlineCode, date } = req.query;

    if (!flightNumber || !airlineCode || !date) {
      return res.status(400).json({ 
        message: 'Flight number, airline code, and date are required' 
      });
    }

    // Format date as YYYYMMDD
    const formatDateForAirline = (dateStr) => {
      const d = new Date(dateStr);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const airlineInfo = await flightApiService.getAirlineInfo({
      flightNumber,
      airlineCode: airlineCode.toUpperCase(),
      date: formatDateForAirline(date)
    });

    res.json({
      success: true,
      data: airlineInfo
    });
  } catch (error) {
    console.error('Airline info error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching airline information'
    });
  }
});

// @route   GET /api/flights/schedule
// @desc    Get flight schedule for airport
// @access  Public
router.get('/schedule', async (req, res) => {
  try {
    const { mode = 'departures', iata, day = 1 } = req.query;

    if (!iata) {
      return res.status(400).json({ 
        message: 'Airport IATA code is required' 
      });
    }

    const schedule = await flightApiService.getSchedule({
      mode,
      iata: iata.toUpperCase(),
      day: parseInt(day)
    });

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Schedule error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching flight schedule'
    });
  }
});

// @route   GET /api/flights/search-iata
// @desc    Search for IATA codes
// @access  Public
router.get('/search-iata', async (req, res) => {
  try {
    const { name, type = 'airline' } = req.query;

    if (!name) {
      return res.status(400).json({ 
        message: 'Search name is required' 
      });
    }

    const iataData = await flightApiService.searchIATA({
      name,
      type
    });

    res.json({
      success: true,
      data: iataData
    });
  } catch (error) {
    console.error('IATA search error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error searching IATA codes'
    });
  }
});

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

    // Also search using external API if available
    let externalResults = [];
    if (search) {
      try {
        const iataResults = await flightApiService.searchIATA({
          name: search,
          type: 'airport'
        });
        externalResults = iataResults.airports || [];
      } catch (err) {
        console.log('External airport search failed:', err.message);
      }
    }

    res.json({
      success: true,
      data: {
        local: airports,
        external: externalResults
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/flights/search
// @desc    Search flights (uses external API)
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const {
      from,
      to,
      departureDate,
      returnDate,
      passengers = 1,
      children = 0,
      infants = 0,
      class: flightClass = 'Economy',
      currency = 'USD'
    } = req.query;

    if (!from || !to || !departureDate) {
      return res.status(400).json({ 
        message: 'From, to, and departure date are required' 
      });
    }

    // Convert date format to YYYY-MM-DD
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    let flightResults;

    // Use appropriate API endpoint based on trip type
    if (returnDate) {
      // Round-trip search
      flightResults = await flightApiService.searchRoundTrip({
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        departDate: formatDate(departureDate),
        returnDate: formatDate(returnDate),
        adults: parseInt(passengers),
        children: parseInt(children),
        infants: parseInt(infants),
        cabinClass: flightClass,
        currency
      });
    } else {
      // One-way search
      flightResults = await flightApiService.searchOneWay({
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        date: formatDate(departureDate),
        adults: parseInt(passengers),
        children: parseInt(children),
        infants: parseInt(infants),
        cabinClass: flightClass,
        currency
      });
    }

    res.json({
      success: true,
      data: {
        flights: flightResults.flights || [],
        airlines: flightResults.airlines || [],
        airports: flightResults.airports || [],
        filters: flightResults.filters || {},
        searchParams: {
          from,
          to,
          departureDate,
          returnDate,
          passengers: parseInt(passengers),
          children: parseInt(children),
          infants: parseInt(infants),
          class: flightClass,
          currency
        },
        metadata: flightResults.metadata
      }
    });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error searching flights',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
