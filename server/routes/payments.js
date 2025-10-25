const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for booking
// @access  Private
router.post('/create-payment-intent', auth, [
  body('bookingId').notEmpty().withMessage('Booking ID is required'),
  body('paymentMethod').isIn(['card', 'bank_transfer']).withMessage('Valid payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookingId, paymentMethod } = req.body;

    // Get booking details
    const booking = await Booking.findOne({ 
      bookingId, 
      user: req.user._id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.payment.status === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.pricing.total * 100), // Convert to cents
      currency: booking.pricing.currency.toLowerCase(),
      metadata: {
        bookingId: booking.bookingId,
        userId: req.user._id.toString(),
        bookingType: booking.type
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update booking with payment intent
    booking.payment.paymentIntentId = paymentIntent.id;
    booking.payment.method = paymentMethod;
    await booking.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: booking.pricing.total,
        currency: booking.pricing.currency
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment completion
// @access  Private
router.post('/confirm-payment', auth, [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Find and update booking
    const booking = await Booking.findOne({ 
      'payment.paymentIntentId': paymentIntentId,
      user: req.user._id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking payment status
    booking.payment.status = 'completed';
    booking.payment.transactionId = paymentIntent.id;
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';

    await booking.save();

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        booking: booking,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/refund
// @desc    Process refund for cancelled booking
// @access  Private
router.post('/refund', auth, [
  body('bookingId').notEmpty().withMessage('Booking ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookingId } = req.body;

    const booking = await Booking.findOne({ 
      bookingId, 
      user: req.user._id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'cancelled') {
      return res.status(400).json({ message: 'Booking is not cancelled' });
    }

    if (booking.payment.status !== 'completed') {
      return res.status(400).json({ message: 'No payment to refund' });
    }

    if (booking.cancellation.refundStatus === 'completed') {
      return res.status(400).json({ message: 'Refund already processed' });
    }

    // Process refund through Stripe
    let refund = null;
    if (booking.payment.transactionId) {
      try {
        refund = await stripe.refunds.create({
          payment_intent: booking.payment.transactionId,
          amount: Math.round(booking.cancellation.refundAmount * 100),
          reason: 'requested_by_customer'
        });
      } catch (stripeError) {
        console.error('Stripe refund error:', stripeError);
        return res.status(400).json({ message: 'Refund processing failed' });
      }
    }

    // Update booking refund status
    booking.cancellation.refundStatus = 'completed';
    if (refund) {
      booking.cancellation.refundTransactionId = refund.id;
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundAmount: booking.cancellation.refundAmount,
        refundId: refund?.id,
        status: 'completed'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/methods
// @desc    Get available payment methods
// @access  Public
router.get('/methods', async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Visa, Mastercard, American Express',
        icon: '💳',
        enabled: true
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer',
        icon: '🏦',
        enabled: true
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: '🅿️',
        enabled: false
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        description: 'Pay with Apple Pay',
        icon: '🍎',
        enabled: false
      },
      {
        id: 'google_pay',
        name: 'Google Pay',
        description: 'Pay with Google Pay',
        icon: '🔵',
        enabled: false
      }
    ];

    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const bookings = await Booking.find({ 
      user: req.user._id,
      'payment.status': 'completed'
    })
    .select('bookingId type status pricing payment createdAt')
    .sort({ 'payment.paidAt': -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Booking.countDocuments({ 
      user: req.user._id,
      'payment.status': 'completed'
    });

    res.json({
      success: true,
      data: {
        payments: bookings,
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

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update booking status in database
      await Booking.findOneAndUpdate(
        { 'payment.paymentIntentId': paymentIntent.id },
        {
          'payment.status': 'completed',
          'payment.transactionId': paymentIntent.id,
          'payment.paidAt': new Date(),
          status: 'confirmed'
        }
      );
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Update booking status
      await Booking.findOneAndUpdate(
        { 'payment.paymentIntentId': failedPayment.id },
        {
          'payment.status': 'failed',
          status: 'cancelled'
        }
      );
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
