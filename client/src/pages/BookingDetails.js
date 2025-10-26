import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../utils/api';
import { FiArrowLeft, FiCalendar, FiDollarSign, FiUser, FiHome, FiCar, FiPackage } from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: bookingData, isLoading, error } = useQuery(
    ['booking', id],
    () => api.get(`${endpoints.bookingDetails}/${id}`),
    { retry: 1 }
  );

  const booking = bookingData?.data?.data;

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
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <LoadingSkeleton height="400px" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking not found</h3>
              <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
              <button
                onClick={() => navigate('/bookings')}
                className="btn btn-primary"
              >
                Back to Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Icon = getTypeIcon(booking.type);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => navigate('/bookings')}
              className="btn btn-outline btn-sm"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600">Booking ID: {booking.bookingId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Overview */}
              <div className="card p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 capitalize">
                      {booking.type} Booking
                    </h2>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        Booked on {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Specific Details */}
                {booking.type === 'flight' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Flight Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Flight Number:</span>
                            <span className="text-gray-900">{booking.flight?.flight?.flightNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Airline:</span>
                            <span className="text-gray-900">{booking.flight?.flight?.airline?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Route:</span>
                            <span className="text-gray-900">
                              {booking.flight?.flight?.departure?.airport?.iataCode} → {booking.flight?.flight?.arrival?.airport?.iataCode}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Departure:</span>
                            <span className="text-gray-900">
                              {formatDateTime(booking.flight?.flight?.departure?.scheduledTime)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Arrival:</span>
                            <span className="text-gray-900">
                              {formatDateTime(booking.flight?.flight?.arrival?.scheduledTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Passengers</h3>
                        <div className="space-y-2">
                          {booking.flight?.passengers?.map((passenger, index) => (
                            <div key={index} className="text-sm">
                              <span className="text-gray-900">
                                {passenger.firstName} {passenger.lastName}
                              </span>
                              <span className="text-gray-600 ml-2">
                                ({passenger.gender}, {new Date(passenger.dateOfBirth).toLocaleDateString()})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {booking.type === 'hotel' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Hotel Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hotel:</span>
                            <span className="text-gray-900">{booking.hotel?.hotel?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Room Type:</span>
                            <span className="text-gray-900">{booking.hotel?.roomType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rooms:</span>
                            <span className="text-gray-900">{booking.hotel?.rooms}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Check-in:</span>
                            <span className="text-gray-900">{formatDate(booking.hotel?.checkIn)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Check-out:</span>
                            <span className="text-gray-900">{formatDate(booking.hotel?.checkOut)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Guests</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Adults:</span>
                            <span className="text-gray-900">{booking.hotel?.guests?.adults}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Children:</span>
                            <span className="text-gray-900">{booking.hotel?.guests?.children}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Infants:</span>
                            <span className="text-gray-900">{booking.hotel?.guests?.infants}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {booking.type === 'cab' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Trip Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle:</span>
                            <span className="text-gray-900">
                              {booking.cab?.cab?.make} {booking.cab?.cab?.model}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Driver:</span>
                            <span className="text-gray-900">{booking.cab?.cab?.driver?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pickup:</span>
                            <span className="text-gray-900">{booking.cab?.pickup?.address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dropoff:</span>
                            <span className="text-gray-900">{booking.cab?.dropoff?.address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date & Time:</span>
                            <span className="text-gray-900">
                              {formatDateTime(booking.cab?.pickup?.datetime)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Passenger Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Passengers:</span>
                            <span className="text-gray-900">{booking.cab?.passengers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Luggage:</span>
                            <span className="text-gray-900">{booking.cab?.luggage} bags</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {booking.type === 'package' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Package Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Package:</span>
                            <span className="text-gray-900">{booking.package?.package?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Destination:</span>
                            <span className="text-gray-900">
                              {booking.package?.package?.destination?.city}, {booking.package?.package?.destination?.country}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="text-gray-900">
                              {booking.package?.package?.duration?.days} days, {booking.package?.package?.duration?.nights} nights
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Departure:</span>
                            <span className="text-gray-900">{formatDate(booking.package?.departureDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Return:</span>
                            <span className="text-gray-900">{formatDate(booking.package?.returnDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Travelers</h3>
                        <div className="space-y-2">
                          {booking.package?.travelers?.map((traveler, index) => (
                            <div key={index} className="text-sm">
                              <span className="text-gray-900">
                                {traveler.firstName} {traveler.lastName}
                              </span>
                              <span className="text-gray-600 ml-2">
                                ({traveler.type}, {traveler.gender})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
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
                </div>
              </div>

              {/* Payment Status */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.payment.status === 'completed' 
                        ? 'text-green-600 bg-green-100' 
                        : 'text-yellow-600 bg-yellow-100'
                    }`}>
                      {booking.payment.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="text-gray-900 capitalize">{booking.payment.method}</span>
                  </div>
                  {booking.payment.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid On:</span>
                      <span className="text-gray-900">{formatDate(booking.payment.paidAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  {booking.status === 'confirmed' && (
                    <button className="btn btn-outline w-full">
                      Cancel Booking
                    </button>
                  )}
                  <button className="btn btn-outline w-full">
                    Download Receipt
                  </button>
                  <button className="btn btn-outline w-full">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
