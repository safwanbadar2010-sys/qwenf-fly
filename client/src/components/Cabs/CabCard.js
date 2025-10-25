import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCar, FiUser, FiStar, FiWifi, FiClock, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CabCard = ({ cab, searchParams }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getVehicleIcon = (type) => {
    const iconMap = {
      sedan: '🚗',
      suv: '🚙',
      luxury: '🏎️',
      minivan: '🚐',
      bus: '🚌'
    };
    return iconMap[type] || '🚗';
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      wifi: FiWifi,
      ac: '❄️',
      music_system: '🎵',
      gps: '🗺️',
      child_seat: '👶',
      wheelchair_accessible: '♿',
      phone_charger: '🔌',
      water_bottles: '💧'
    };
    return iconMap[amenity] || FiStar;
  };

  const formatEstimatedTime = (distance) => {
    if (!distance) return 'N/A';
    const timeInMinutes = Math.round(distance * 1.5); // Rough estimate
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover p-6"
    >
      <div className="flex items-center justify-between">
        {/* Vehicle Info */}
        <div className="flex items-center space-x-4">
          <div className="text-4xl">
            {getVehicleIcon(cab.vehicleType)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {cab.make} {cab.model}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {cab.vehicleType} • {cab.year}
            </p>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                <FiUser className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {cab.capacity.passengers} passengers
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">
                  {cab.capacity.luggage} bags
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <FiUser className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">{cab.driver.name}</div>
            <div className="flex items-center space-x-1">
              <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-gray-600">{cab.driver.rating}</span>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">
            {searchParams.pickup} → {searchParams.dropoff || 'Destination'}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FiMapPin className="w-4 h-4" />
              <span>{cab.distance?.toFixed(1) || 'N/A'} km</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiClock className="w-4 h-4" />
              <span>{formatEstimatedTime(cab.distance)}</span>
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            ${cab.estimatedFare}
          </div>
          <div className="text-sm text-gray-500 mb-4">estimated fare</div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-outline btn-sm"
            >
              {isExpanded ? 'Less Details' : 'More Details'}
            </button>
            <Link
              to={`/cabs/${cab._id}/book`}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vehicle Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Vehicle Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Make:</span>
                  <span className="text-gray-900">{cab.make}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="text-gray-900">{cab.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="text-gray-900">{cab.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="text-gray-900">{cab.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License:</span>
                  <span className="text-gray-900">{cab.licensePlate}</span>
                </div>
              </div>
            </div>

            {/* Driver Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Driver Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="text-gray-900">{cab.driver.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-900">{cab.driver.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="text-gray-900">{cab.driver.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="text-gray-900">{cab.driver.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Languages:</span>
                  <span className="text-gray-900">{cab.driver.languages?.join(', ') || 'English'}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Pricing</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Rate:</span>
                  <span className="text-gray-900">${cab.pricing.baseRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Per KM:</span>
                  <span className="text-gray-900">${cab.pricing.perKmRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Per Hour:</span>
                  <span className="text-gray-900">${cab.pricing.perHourRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Fare:</span>
                  <span className="text-gray-900">${cab.pricing.minimumFare}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Vehicle Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {cab.amenities?.map((amenity, index) => {
                const icon = getAmenityIcon(amenity);
                return (
                  <div key={index} className="flex items-center space-x-1 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <span>{icon}</span>
                    <span>{amenity.replace('_', ' ')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CabCard;
