const express = require('express');
const { body, validationResult } = require('express-validator');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');
const hotelApiService = require('../services/hotelApiService');

const router = express.Router();

// @route   GET /api/hotels/search
// @desc    Search hotels (uses external API)
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const {
      city,
      cityId,
      query,
      checkIn,
      checkOut,
      guests = 2,
      rooms = 1,
      children = 0,
      currency = 'USD'
    } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ 
        message: 'Check-in and check-out dates are required' 
      });
    }

    // Format date as YYYY-MM-DD
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    let hotelResults;

    // Use different search methods based on parameters
    if (cityId) {
      // Search by city ID
      hotelResults = await hotelApiService.searchByCity({
        cityId,
        checkIn: formatDate(checkIn),
        checkOut: formatDate(checkOut),
        rooms: parseInt(rooms),
        adults: parseInt(guests),
        children: parseInt(children),
        currency
      });
    } else if (query || city) {
      // Search by name or location
      hotelResults = await hotelApiService.searchHotels({
        query: query || city,
        checkIn: formatDate(checkIn),
        checkOut: formatDate(checkOut),
        rooms: parseInt(rooms),
        adults: parseInt(guests),
        currency
      });
    } else {
      return res.status(400).json({ 
        message: 'City, cityId, or search query is required' 
      });
    }

    res.json({
      success: true,
      data: {
        hotels: hotelResults.hotels || [],
        filters: hotelResults.filters || {},
        searchParams: {
          city: city || query,
          cityId,
          checkIn,
          checkOut,
          guests: parseInt(guests),
          rooms: parseInt(rooms),
          children: parseInt(children),
          currency
        },
        metadata: hotelResults.metadata
      }
    });
  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error searching hotels',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   GET /api/hotels/:id
// @desc    Get hotel details (uses external API)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { checkIn, checkOut, rooms = 1, adults = 1, children = 0 } = req.query;
    const hotelId = req.params.id;

    // If dates are provided, fetch from external API
    if (checkIn && checkOut) {
      const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      };

      const hotelDetails = await hotelApiService.getHotelDetails({
        hotelId,
        checkIn: formatDate(checkIn),
        checkOut: formatDate(checkOut),
        rooms: parseInt(rooms),
        adults: parseInt(adults),
        children: parseInt(children)
      });

      return res.json({
        success: true,
        data: hotelDetails.hotel,
        rooms: hotelDetails.rooms,
        amenities: hotelDetails.amenities,
        images: hotelDetails.images,
        metadata: hotelDetails.metadata
      });
    }

    // Fallback to local database
    const hotel = await Hotel.findById(hotelId)
      .populate('reviews.user', 'firstName lastName');

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Hotel details error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching hotel details'
    });
  }
});

// @route   GET /api/hotels/booking-info/:hotelId
// @desc    Get hotel booking information
// @access  Public
router.get('/booking-info/:hotelId', async (req, res) => {
  try {
    const { country = 'us', checkIn, checkOut, rooms = 1, adults = 2, kids = 0, currency = 'USD' } = req.query;
    const hotelId = req.params.hotelId;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ 
        message: 'Check-in and check-out dates are required' 
      });
    }

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    const bookingInfo = await hotelApiService.getBookingInfo({
      country,
      hotelId,
      checkIn: formatDate(checkIn),
      checkOut: formatDate(checkOut),
      rooms: parseInt(rooms),
      adults: parseInt(adults),
      kids: parseInt(kids),
      currency
    });

    res.json({
      success: true,
      data: bookingInfo
    });
  } catch (error) {
    console.error('Booking info error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching booking information'
    });
  }
});

// @route   GET /api/hotels/expedia/:hotelId
// @desc    Get Expedia hotel data
// @access  Public
router.get('/expedia/:hotelId', async (req, res) => {
  try {
    const { checkIn, checkOut, rooms = 1, adults = 2, currency = 'USD' } = req.query;
    const hotelId = req.params.hotelId;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ 
        message: 'Check-in and check-out dates are required' 
      });
    }

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    const expediaData = await hotelApiService.getExpediaHotel({
      hotelId,
      checkIn: formatDate(checkIn),
      checkOut: formatDate(checkOut),
      rooms: parseInt(rooms),
      adults: parseInt(adults),
      currency
    });

    res.json({
      success: true,
      data: expediaData
    });
  } catch (error) {
    console.error('Expedia hotel error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching Expedia hotel data'
    });
  }
});

// @route   GET /api/hotels/map-name
// @desc    Map hotel name to ID
// @access  Public
router.get('/map-name', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ 
        message: 'Hotel name is required' 
      });
    }

    const mappingData = await hotelApiService.mapHotelName({ name });

    res.json({
      success: true,
      data: mappingData
    });
  } catch (error) {
    console.error('Hotel mapping error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error mapping hotel name'
    });
  }
});

// @route   GET /api/hotels/account
// @desc    Get API account information
// @access  Private
router.get('/account', auth, async (req, res) => {
  try {
    const accountInfo = await hotelApiService.getAccountInfo();

    res.json({
      success: true,
      data: accountInfo
    });
  } catch (error) {
    console.error('Account info error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching account information'
    });
  }
});

// @route   POST /api/hotels/book
// @desc    Book a hotel
// @access  Private
router.post('/book', auth, [
  body('hotelId').notEmpty().withMessage('Hotel ID is required'),
  body('roomType').notEmpty().withMessage('Room type is required'),
  body('rooms').isInt({ min: 1 }).withMessage('At least one room is required'),
  body('guests.adults').isInt({ min: 1 }).withMessage('At least one adult is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      hotelId, 
      roomType, 
      rooms, 
      guests, 
      checkIn, 
      checkOut, 
      specialRequests 
    } = req.body;

    // Get hotel details
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Find the room type
    const room = hotel.rooms.find(r => r.type === roomType);
    if (!room) {
      return res.status(400).json({ message: 'Room type not available' });
    }

    // Check availability (simplified - in real app, check actual availability)
    if (room.availability.length === 0) {
      return res.status(400).json({ message: 'No rooms available for selected dates' });
    }

    // Calculate pricing
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    const basePrice = room.pricing.basePrice;
    const taxes = room.pricing.taxes || 0;
    const fees = room.pricing.fees || 0;
    const totalPrice = (basePrice + taxes + fees) * rooms * nights;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      type: 'hotel',
      hotel: {
        hotel: hotelId,
        roomType,
        rooms,
        guests,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        specialRequests
      },
      pricing: {
        basePrice: basePrice * rooms * nights,
        taxes: taxes * rooms * nights,
        fees: fees * rooms * nights,
        total: totalPrice
      }
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Hotel booked successfully',
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

// @route   POST /api/hotels/:id/reviews
// @desc    Add hotel review
// @access  Private
router.post('/:id/reviews', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const hotelId = req.params.id;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Check if user has already reviewed this hotel
    const existingReview = hotel.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this hotel' });
    }

    // Add review
    hotel.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    // Update average rating
    const totalRating = hotel.reviews.reduce((sum, review) => sum + review.rating, 0);
    hotel.averageRating = totalRating / hotel.reviews.length;
    hotel.totalReviews = hotel.reviews.length;

    await hotel.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: {
        review: hotel.reviews[hotel.reviews.length - 1]
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hotels/popular-destinations
// @desc    Get popular hotel destinations
// @access  Public
router.get('/popular-destinations', async (req, res) => {
  try {
    const popularDestinations = [
      {
        city: 'New York',
        country: 'USA',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500',
        hotels: 1250,
        avgPrice: 299
      },
      {
        city: 'London',
        country: 'UK',
        image: 'https://images.unsplash.com/photo-1513639769931-4c4b4a5b5b5b?w=500',
        hotels: 890,
        avgPrice: 199
      },
      {
        city: 'Paris',
        country: 'France',
        image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=500',
        hotels: 1100,
        avgPrice: 249
      },
      {
        city: 'Dubai',
        country: 'UAE',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea2fbec9b90?w=500',
        hotels: 750,
        avgPrice: 399
      }
    ];

    res.json({
      success: true,
      data: popularDestinations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hotels/amenities
// @desc    Get all available amenities
// @access  Public
router.get('/amenities', async (req, res) => {
  try {
    const amenities = [
      'wifi', 'pool', 'gym', 'spa', 'restaurant', 'bar', 'room_service',
      'concierge', 'parking', 'airport_shuttle', 'business_center',
      'laundry', 'pet_friendly', 'beach_access', 'mountain_view',
      'city_view', 'garden', 'terrace', 'balcony'
    ];

    res.json({
      success: true,
      data: amenities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
