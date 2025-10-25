const express = require('express');
const { body, validationResult } = require('express-validator');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/hotels/search
// @desc    Search hotels
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const {
      city,
      country,
      checkIn,
      checkOut,
      guests = 1,
      rooms = 1,
      minPrice,
      maxPrice,
      starRating,
      amenities,
      sortBy = 'rating'
    } = req.query;

    if (!city || !checkIn || !checkOut) {
      return res.status(400).json({ 
        message: 'City, check-in, and check-out dates are required' 
      });
    }

    let query = {
      isActive: true,
      $or: [
        { 'address.city': { $regex: city, $options: 'i' } },
        { 'address.country': { $regex: country, $options: 'i' } }
      ]
    };

    // Add filters
    if (starRating) {
      query.starRating = { $gte: parseInt(starRating) };
    }

    if (amenities) {
      const amenityArray = amenities.split(',');
      query.amenities = { $in: amenityArray };
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price':
        sort = { 'rooms.pricing.total': 1 };
        break;
      case 'rating':
        sort = { averageRating: -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      default:
        sort = { averageRating: -1 };
    }

    const hotels = await Hotel.find(query)
      .select('name description address starRating amenities images rooms pricing averageRating totalReviews')
      .sort(sort);

    // Filter by price range if specified
    let filteredHotels = hotels;
    if (minPrice || maxPrice) {
      filteredHotels = hotels.filter(hotel => {
        const roomPrices = hotel.rooms.map(room => room.pricing.total);
        const minRoomPrice = Math.min(...roomPrices);
        const maxRoomPrice = Math.max(...roomPrices);
        
        if (minPrice && minRoomPrice < parseInt(minPrice)) return false;
        if (maxPrice && maxRoomPrice > parseInt(maxPrice)) return false;
        return true;
      });
    }

    res.json({
      success: true,
      data: {
        hotels: filteredHotels,
        searchParams: {
          city,
          country,
          checkIn,
          checkOut,
          guests: parseInt(guests),
          rooms: parseInt(rooms)
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hotels/:id
// @desc    Get hotel details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName');

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
