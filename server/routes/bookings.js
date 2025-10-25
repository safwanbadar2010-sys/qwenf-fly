const express = require('express');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user._id };
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('flight.flight', 'flightNumber airline departure arrival')
      .populate('hotel.hotel', 'name address starRating')
      .populate('cab.cab', 'vehicleType make model driver')
      .populate('package.package', 'name destination duration')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    })
    .populate('flight.flight', 'flightNumber airline departure arrival')
    .populate('hotel.hotel', 'name address starRating amenities')
    .populate('cab.cab', 'vehicleType make model driver')
    .populate('package.package', 'name destination duration itinerary');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    // Calculate refund based on cancellation policy
    let refundAmount = 0;
    const now = new Date();
    const bookingDate = booking.createdAt;
    const daysDifference = Math.ceil((now - bookingDate) / (1000 * 60 * 60 * 24));

    // Different cancellation policies for different booking types
    switch (booking.type) {
      case 'flight':
        if (daysDifference >= 7) {
          refundAmount = booking.pricing.total * 0.8; // 80% refund
        } else if (daysDifference >= 3) {
          refundAmount = booking.pricing.total * 0.5; // 50% refund
        } else {
          refundAmount = booking.pricing.total * 0.2; // 20% refund
        }
        break;
      case 'hotel':
        if (daysDifference >= 7) {
          refundAmount = booking.pricing.total * 0.9; // 90% refund
        } else if (daysDifference >= 3) {
          refundAmount = booking.pricing.total * 0.7; // 70% refund
        } else {
          refundAmount = booking.pricing.total * 0.3; // 30% refund
        }
        break;
      case 'cab':
        if (daysDifference >= 1) {
          refundAmount = booking.pricing.total * 0.8; // 80% refund
        } else {
          refundAmount = booking.pricing.total * 0.5; // 50% refund
        }
        break;
      case 'package':
        if (daysDifference >= 14) {
          refundAmount = booking.pricing.total * 0.9; // 90% refund
        } else if (daysDifference >= 7) {
          refundAmount = booking.pricing.total * 0.7; // 70% refund
        } else {
          refundAmount = booking.pricing.total * 0.4; // 40% refund
        }
        break;
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellation = {
      isCancelled: true,
      cancelledAt: new Date(),
      cancelledBy: 'user',
      refundAmount: Math.round(refundAmount),
      refundStatus: refundAmount > 0 ? 'pending' : 'completed',
      refundReason: reason || 'User requested cancellation'
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking: booking,
        refundAmount: Math.round(refundAmount)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/stats/summary
// @desc    Get booking statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ user: req.user._id });
    const totalSpent = await Booking.aggregate([
      { $match: { user: req.user._id, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    const bookingsByType = await Booking.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const bookingsByStatus = await Booking.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        totalSpent: totalSpent[0]?.total || 0,
        bookingsByType,
        bookingsByStatus
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
