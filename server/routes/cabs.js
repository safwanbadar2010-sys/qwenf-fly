const express = require('express');
const { body, validationResult } = require('express-validator');
const Cab = require('../models/Cab');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cabs/search
// @desc    Search available cabs
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const {
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      vehicleType,
      passengers = 1,
      luggage = 0,
      datetime
    } = req.query;

    if (!pickupLat || !pickupLng) {
      return res.status(400).json({ 
        message: 'Pickup location is required' 
      });
    }

    // Calculate distance (simplified - in real app, use proper distance calculation)
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    let query = {
      'availability.isAvailable': true,
      'capacity.passengers': { $gte: parseInt(passengers) },
      'capacity.luggage': { $gte: parseInt(luggage) }
    };

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    const cabs = await Cab.find(query)
      .select('vehicleType make model year color capacity amenities images driver pricing location')
      .limit(20);

    // Calculate estimated fare for each cab
    const cabsWithFare = cabs.map(cab => {
      let distance = 0;
      if (dropoffLat && dropoffLng) {
        distance = calculateDistance(
          parseFloat(pickupLat), 
          parseFloat(pickupLng),
          parseFloat(dropoffLat), 
          parseFloat(dropoffLng)
        );
      }

      const estimatedFare = cab.pricing.baseRate + (distance * cab.pricing.perKmRate);
      
      return {
        ...cab.toObject(),
        estimatedFare: Math.round(estimatedFare),
        distance: Math.round(distance * 10) / 10
      };
    });

    // Sort by estimated fare
    cabsWithFare.sort((a, b) => a.estimatedFare - b.estimatedFare);

    res.json({
      success: true,
      data: {
        cabs: cabsWithFare,
        searchParams: {
          pickup: { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) },
          dropoff: dropoffLat && dropoffLng ? 
            { lat: parseFloat(dropoffLat), lng: parseFloat(dropoffLng) } : null,
          passengers: parseInt(passengers),
          luggage: parseInt(luggage),
          vehicleType
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cabs/:id
// @desc    Get cab details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id);

    if (!cab) {
      return res.status(404).json({ message: 'Cab not found' });
    }

    res.json({
      success: true,
      data: cab
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cabs/book
// @desc    Book a cab
// @access  Private
router.post('/book', auth, [
  body('cabId').notEmpty().withMessage('Cab ID is required'),
  body('pickup.address').notEmpty().withMessage('Pickup address is required'),
  body('pickup.latitude').isNumeric().withMessage('Valid pickup latitude is required'),
  body('pickup.longitude').isNumeric().withMessage('Valid pickup longitude is required'),
  body('pickup.datetime').isISO8601().withMessage('Valid pickup datetime is required'),
  body('dropoff.address').notEmpty().withMessage('Dropoff address is required'),
  body('dropoff.latitude').isNumeric().withMessage('Valid dropoff latitude is required'),
  body('dropoff.longitude').isNumeric().withMessage('Valid dropoff longitude is required'),
  body('passengers').isInt({ min: 1 }).withMessage('At least one passenger is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      cabId, 
      pickup, 
      dropoff, 
      passengers, 
      luggage, 
      specialRequests 
    } = req.body;

    // Get cab details
    const cab = await Cab.findById(cabId);
    if (!cab) {
      return res.status(404).json({ message: 'Cab not found' });
    }

    // Check availability
    if (!cab.availability.isAvailable) {
      return res.status(400).json({ message: 'Cab is not available' });
    }

    // Calculate distance and fare
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const distance = calculateDistance(
      pickup.latitude, 
      pickup.longitude,
      dropoff.latitude, 
      dropoff.longitude
    );

    const baseFare = cab.pricing.baseRate;
    const distanceFare = distance * cab.pricing.perKmRate;
    const totalFare = (baseFare + distanceFare) * cab.pricing.surgeMultiplier;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      type: 'cab',
      cab: {
        cab: cabId,
        pickup: {
          address: pickup.address,
          coordinates: {
            latitude: pickup.latitude,
            longitude: pickup.longitude
          },
          datetime: new Date(pickup.datetime)
        },
        dropoff: {
          address: dropoff.address,
          coordinates: {
            latitude: dropoff.latitude,
            longitude: dropoff.longitude
          }
        },
        passengers: parseInt(passengers),
        luggage: parseInt(luggage) || 0,
        specialRequests
      },
      pricing: {
        basePrice: baseFare,
        taxes: 0,
        fees: 0,
        total: Math.round(totalFare)
      }
    });

    await booking.save();

    // Update cab availability
    cab.availability.isAvailable = false;
    await cab.save();

    res.status(201).json({
      success: true,
      message: 'Cab booked successfully',
      data: {
        bookingId: booking.bookingId,
        booking: booking,
        estimatedFare: Math.round(totalFare),
        distance: Math.round(distance * 10) / 10
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cabs/vehicle-types
// @desc    Get available vehicle types
// @access  Public
router.get('/vehicle-types', async (req, res) => {
  try {
    const vehicleTypes = [
      {
        type: 'sedan',
        name: 'Sedan',
        description: 'Comfortable 4-seater car',
        capacity: { passengers: 4, luggage: 2 },
        icon: '🚗'
      },
      {
        type: 'suv',
        name: 'SUV',
        description: 'Spacious 6-seater vehicle',
        capacity: { passengers: 6, luggage: 4 },
        icon: '🚙'
      },
      {
        type: 'hatchback',
        name: 'Hatchback',
        description: 'Compact and economical',
        capacity: { passengers: 4, luggage: 2 },
        icon: '🚐'
      },
      {
        type: 'luxury',
        name: 'Luxury',
        description: 'Premium luxury vehicle',
        capacity: { passengers: 4, luggage: 3 },
        icon: '🏎️'
      },
      {
        type: 'minivan',
        name: 'Minivan',
        description: 'Large family vehicle',
        capacity: { passengers: 8, luggage: 6 },
        icon: '🚐'
      }
    ];

    res.json({
      success: true,
      data: vehicleTypes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cabs/amenities
// @desc    Get available amenities
// @access  Public
router.get('/amenities', async (req, res) => {
  try {
    const amenities = [
      { name: 'wifi', label: 'WiFi', icon: '📶' },
      { name: 'ac', label: 'Air Conditioning', icon: '❄️' },
      { name: 'music_system', label: 'Music System', icon: '🎵' },
      { name: 'gps', label: 'GPS Navigation', icon: '🗺️' },
      { name: 'child_seat', label: 'Child Seat', icon: '👶' },
      { name: 'wheelchair_accessible', label: 'Wheelchair Accessible', icon: '♿' },
      { name: 'phone_charger', label: 'Phone Charger', icon: '🔌' },
      { name: 'water_bottles', label: 'Water Bottles', icon: '💧' }
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
