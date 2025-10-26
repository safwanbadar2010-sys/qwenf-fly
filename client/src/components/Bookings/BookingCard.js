import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCar, FiPackage, FiCalendar, FiDollarSign, FiEye, FiX } from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BookingCard = ({ booking }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = (type) => {
    const iconMap = {
      flight: FaPlane,
      hotel: FiHome,
      cab: FiCar,
      package: FiPackage
    };
    return iconMap[type] || FiCalendar;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
      completed: 'text-blue-600 bg-blue-100',
      refunded: 'text-gray-600 bg-gray-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBookingTitle = () => {
    switch (booking.type) {
      case 'flight':
        return `${booking.flight?.flight?.flightNumber || 'Flight'} - ${booking.flight?.flight?.airline?.name || 'Airline'}`;
      case 'hotel':
        return `${booking.hotel?.hotel?.name || 'Hotel'} - ${booking.hotel?.roomType || 'Room'}`;
      case 'cab':
        return `${booking.cab?.cab?.make || 'Vehicle'} ${booking.cab?.cab?.model || ''} - ${booking.cab?.cab?.driver?.name || 'Driver'}`;
      case 'package':
        return `${booking.package?.package?.name || 'Package'} - ${booking.package?.package?.destination?.city || 'Destination'}`;
      default:
        return 'Booking';
    }
  };

  const getBookingDetails = () => {
    switch (booking.type) {
      case 'flight':
        return {
          from: booking.flight?.flight?.departure?.airport?.iataCode || 'N/A',
          to: booking.flight?.flight?.arrival?.airport?.iataCode || 'N/A',
          date: booking.flight?.flight?.departure?.scheduledTime,
          passengers: booking.flight?.passengers?.length || 0
        };
      case 'hotel':
        return {
          checkIn: booking.hotel?.checkIn,
          checkOut: booking.hotel?.checkOut,
          guests: booking.hotel?.guests?.adults || 0,
          rooms: booking.hotel?.rooms || 0
        };
      case 'cab':
        return {
          pickup: booking.cab?.pickup?.address || 'N/A',
          dropoff: booking.cab?.dropoff?.address || 'N/A',
          date: booking.cab?.pickup?.datetime,
          passengers: booking.cab?.passengers || 0
        };
      case 'package':
        return {
          departure: booking.package?.departureDate,
          return: booking.package?.returnDate,
          travelers: booking.package?.travelers?.length || 0
        };
      default:
        return {};
    }
  };

  const details = getBookingDetails();
  const Icon = getTypeIcon(booking.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover p-6"
    >
      <div className="flex items-center justify-between">
        {/* Booking Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{getBookingTitle()}</h3>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-gray-600">
                Booking ID: {booking.bookingId}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">
            {booking.type === 'flight' && `${details.from} → ${details.to}`}
            {booking.type === 'hotel' && `${formatDate(details.checkIn)} - ${formatDate(details.checkOut)}`}
            {booking.type === 'cab' && `${details.pickup} → ${details.dropoff}`}
            {booking.type === 'package' && `${formatDate(details.departure)} - ${formatDate(details.return)}`}
          </div>
          <div className="text-sm text-gray-500">
            {booking.type === 'flight' && `${details.passengers} passengers`}
            {booking.type === 'hotel' && `${details.guests} guests, ${details.rooms} rooms`}
            {booking.type === 'cab' && `${details.passengers} passengers`}
            {booking.type === 'package' && `${details.travelers} travelers`}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            ${booking.pricing.total}
          </div>
          <div className="text-sm text-gray-500 mb-4">
            {booking.pricing.currency}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-outline btn-sm"
            >
              {isExpanded ? 'Less Details' : 'More Details'}
            </button>
            <Link
              to={`/bookings/${booking._id}`}
              className="btn btn-primary btn-sm"
            >
              <FiEye className="w-4 h-4" />
              View
            </Link>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Booking Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="text-gray-900">{formatDate(booking.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="text-gray-900 capitalize">{booking.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                {booking.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notes:</span>
                    <span className="text-gray-900">{booking.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="text-gray-900">${booking.pricing.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes:</span>
                  <span className="text-gray-900">${booking.pricing.taxes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fees:</span>
                  <span className="text-gray-900">${booking.pricing.fees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discounts:</span>
                  <span className="text-gray-900">-${booking.pricing.discounts}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">${booking.pricing.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.payment.status === 'completed' 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-yellow-600 bg-yellow-100'
                  }`}>
                    {booking.payment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Information */}
          {booking.cancellation?.isCancelled && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Cancellation Information</h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled On:</span>
                    <span className="text-gray-900">{formatDate(booking.cancellation.cancelledAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled By:</span>
                    <span className="text-gray-900 capitalize">{booking.cancellation.cancelledBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund Amount:</span>
                    <span className="text-gray-900">${booking.cancellation.refundAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.cancellation.refundStatus === 'completed' 
                        ? 'text-green-600 bg-green-100' 
                        : 'text-yellow-600 bg-yellow-100'
                    }`}>
                      {booking.cancellation.refundStatus}
                    </span>
                  </div>
                  {booking.cancellation.refundReason && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reason:</span>
                      <span className="text-gray-900">{booking.cancellation.refundReason}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookingCard;
