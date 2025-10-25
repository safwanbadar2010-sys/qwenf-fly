const express = require('express');
const { body, validationResult } = require('express-validator');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/packages/search
// @desc    Search travel packages
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const {
      destination,
      category,
      minPrice,
      maxPrice,
      duration,
      difficulty,
      sortBy = 'rating'
    } = req.query;

    let query = { isActive: true };

    // Add filters
    if (destination) {
      query.$or = [
        { 'destination.city': { $regex: destination, $options: 'i' } },
        { 'destination.country': { $regex: destination, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (duration) {
      query['duration.days'] = { $lte: parseInt(duration) };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price':
        sort = { 'pricing.adult.total': 1 };
        break;
      case 'duration':
        sort = { 'duration.days': 1 };
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

    const packages = await Package.find(query)
      .select('name description shortDescription destination duration images category difficulty pricing averageRating totalReviews')
      .sort(sort);

    // Filter by price range if specified
    let filteredPackages = packages;
    if (minPrice || maxPrice) {
      filteredPackages = packages.filter(pkg => {
        const adultPrice = pkg.pricing.adult.total;
        
        if (minPrice && adultPrice < parseInt(minPrice)) return false;
        if (maxPrice && adultPrice > parseInt(maxPrice)) return false;
        return true;
      });
    }

    res.json({
      success: true,
      data: {
        packages: filteredPackages,
        searchParams: {
          destination,
          category,
          minPrice,
          maxPrice,
          duration,
          difficulty
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/packages/:id
// @desc    Get package details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName');

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/packages/book
// @desc    Book a travel package
// @access  Private
router.post('/book', auth, [
  body('packageId').notEmpty().withMessage('Package ID is required'),
  body('travelers').isArray({ min: 1 }).withMessage('At least one traveler is required'),
  body('travelers.*.firstName').notEmpty().withMessage('First name is required'),
  body('travelers.*.lastName').notEmpty().withMessage('Last name is required'),
  body('travelers.*.dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('travelers.*.gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  body('travelers.*.type').isIn(['adult', 'child', 'infant']).withMessage('Valid traveler type is required'),
  body('departureDate').isISO8601().withMessage('Valid departure date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      packageId, 
      travelers, 
      departureDate, 
      returnDate, 
      specialRequests 
    } = req.body;

    // Get package details
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Calculate pricing based on traveler types
    let totalPrice = 0;
    travelers.forEach(traveler => {
      let price = 0;
      switch (traveler.type) {
        case 'adult':
          price = package.pricing.adult.total;
          break;
        case 'child':
          price = package.pricing.child.total;
          break;
        case 'infant':
          price = package.pricing.infant.total;
          break;
      }
      totalPrice += price;
    });

    // Apply group discount if applicable
    if (package.pricing.groupDiscount && travelers.length >= package.pricing.groupDiscount.minPeople) {
      const discount = (totalPrice * package.pricing.groupDiscount.discountPercent) / 100;
      totalPrice -= discount;
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      type: 'package',
      package: {
        package: packageId,
        travelers,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        specialRequests
      },
      pricing: {
        basePrice: totalPrice,
        taxes: 0,
        fees: 0,
        total: totalPrice
      }
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Package booked successfully',
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

// @route   POST /api/packages/:id/reviews
// @desc    Add package review
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
    const packageId = req.params.id;

    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Check if user has already reviewed this package
    const existingReview = package.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this package' });
    }

    // Add review
    package.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    // Update average rating
    const totalRating = package.reviews.reduce((sum, review) => sum + review.rating, 0);
    package.averageRating = totalRating / package.reviews.length;
    package.totalReviews = package.reviews.length;

    await package.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: {
        review: package.reviews[package.reviews.length - 1]
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/packages/categories
// @desc    Get package categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      {
        name: 'adventure',
        label: 'Adventure',
        icon: '🏔️',
        description: 'Thrilling outdoor experiences'
      },
      {
        name: 'cultural',
        label: 'Cultural',
        icon: '🏛️',
        description: 'Explore local traditions and heritage'
      },
      {
        name: 'beach',
        label: 'Beach',
        icon: '🏖️',
        description: 'Relaxing beach destinations'
      },
      {
        name: 'mountain',
        label: 'Mountain',
        icon: '⛰️',
        description: 'Mountain retreats and hiking'
      },
      {
        name: 'city',
        label: 'City',
        icon: '🏙️',
        description: 'Urban exploration and city tours'
      },
      {
        name: 'wildlife',
        label: 'Wildlife',
        icon: '🦁',
        description: 'Wildlife safaris and nature tours'
      },
      {
        name: 'religious',
        label: 'Religious',
        icon: '🕍',
        description: 'Pilgrimage and spiritual journeys'
      },
      {
        name: 'honeymoon',
        label: 'Honeymoon',
        icon: '💕',
        description: 'Romantic getaways for couples'
      },
      {
        name: 'family',
        label: 'Family',
        icon: '👨‍👩‍👧‍👦',
        description: 'Family-friendly destinations'
      },
      {
        name: 'luxury',
        label: 'Luxury',
        icon: '💎',
        description: 'Premium luxury experiences'
      },
      {
        name: 'budget',
        label: 'Budget',
        icon: '💰',
        description: 'Affordable travel options'
      }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/packages/featured
// @desc    Get featured packages
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredPackages = await Package.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .select('name shortDescription destination duration images category pricing averageRating')
    .sort({ averageRating: -1 })
    .limit(6);

    res.json({
      success: true,
      data: featuredPackages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/packages/popular-destinations
// @desc    Get popular package destinations
// @access  Public
router.get('/popular-destinations', async (req, res) => {
  try {
    const popularDestinations = [
      {
        city: 'Bali',
        country: 'Indonesia',
        image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500',
        packages: 45,
        avgPrice: 899,
        duration: '7 days'
      },
      {
        city: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500',
        packages: 32,
        avgPrice: 1299,
        duration: '5 days'
      },
      {
        city: 'Maldives',
        country: 'Maldives',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        packages: 28,
        avgPrice: 1999,
        duration: '6 days'
      },
      {
        city: 'Switzerland',
        country: 'Switzerland',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        packages: 38,
        avgPrice: 1599,
        duration: '8 days'
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

module.exports = router;
