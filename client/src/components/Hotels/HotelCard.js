import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiWifi, FiCar, FiCoffee, FiDumbbell, FiSwimming } from 'react-icons/fi';
import { motion } from 'framer-motion';

const HotelCard = ({ hotel, searchParams }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      wifi: FiWifi,
      parking: FiCar,
      restaurant: FiCoffee,
      gym: FiDumbbell,
      pool: FiSwimming
    };
    return iconMap[amenity] || FiStar;
  };

  const getLowestPrice = () => {
    if (!hotel.rooms || hotel.rooms.length === 0) return 0;
    return Math.min(...hotel.rooms.map(room => room.pricing.total || room.pricing.basePrice || 0));
  };

  const getAmenities = () => {
    return hotel.amenities?.slice(0, 6) || [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover p-6"
    >
      <div className="flex space-x-6">
        {/* Hotel Image */}
        <div className="w-48 h-32 flex-shrink-0">
          <img
            src={hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'}
            alt={hotel.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Hotel Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
              
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < hotel.starRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {hotel.starRating} stars
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-600">
                  <FiMapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {hotel.address.city}, {hotel.address.country}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {hotel.description}
              </p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {getAmenities().map((amenity, index) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div key={index} className="flex items-center space-x-1 text-xs text-gray-600">
                      <Icon className="w-3 h-3" />
                      <span>{amenity.replace('_', ' ')}</span>
                    </div>
                  );
                })}
                {hotel.amenities?.length > 6 && (
                  <span className="text-xs text-gray-500">
                    +{hotel.amenities.length - 6} more
                  </span>
                )}
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-semibold text-gray-900">
                    {hotel.averageRating?.toFixed(1) || '4.5'}
                  </span>
                  <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">
                    ({hotel.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                ${getLowestPrice()}
              </div>
              <div className="text-sm text-gray-500 mb-4">per night</div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="btn btn-outline btn-sm"
                >
                  {isExpanded ? 'Less Details' : 'More Details'}
                </button>
                <Link
                  to={`/hotels/${hotel._id}/book`}
                  state={{ searchParams }}
                  className="btn btn-primary btn-sm"
                >
                  Book Now
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
                {/* Room Types */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Available Rooms</h4>
                  <div className="space-y-3">
                    {hotel.rooms?.slice(0, 3).map((room, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{room.name}</div>
                          <div className="text-sm text-gray-600">
                            {room.maxOccupancy} guests • {room.size}m²
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ${room.pricing.total || room.pricing.basePrice}
                          </div>
                          <div className="text-sm text-gray-500">per night</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policies */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Hotel Policies</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="text-gray-900">{hotel.policies?.checkIn || '3:00 PM'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="text-gray-900">{hotel.policies?.checkOut || '11:00 AM'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cancellation:</span>
                      <span className="text-gray-900">{hotel.policies?.cancellation || 'Free cancellation'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Amenities */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">All Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities?.map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div key={index} className="flex items-center space-x-1 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        <Icon className="w-4 h-4" />
                        <span>{amenity.replace('_', ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
