import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiMapPin, FiUsers, FiArrowRight } from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FlightCard = ({ flight, searchParams }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPrice = () => {
    const classType = searchParams.class || 'economy';
    return flight.pricing[classType]?.total || flight.pricing.economy?.total || 0;
  };

  const getStopsText = () => {
    if (flight.stops && flight.stops.length > 0) {
      return `${flight.stops.length} stop${flight.stops.length > 1 ? 's' : ''}`;
    }
    return 'Non-stop';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover p-6"
    >
      <div className="flex items-center justify-between">
        {/* Airline Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {flight.airline?.logo ? (
              <img src={flight.airline.logo} alt={flight.airline.name} className="w-8 h-8" />
            ) : (
              <FaPlane className="w-6 h-6 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{flight.airline?.name || 'Airline'}</h3>
            <p className="text-sm text-gray-600">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(flight.departure.scheduledTime)}
            </div>
            <div className="text-sm text-gray-600">
              {flight.departure.airport?.iataCode || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(flight.departure.scheduledTime)}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 text-gray-500">
              <FiClock className="w-4 h-4" />
              <span className="text-sm">{formatDuration(flight.duration)}</span>
            </div>
            <div className="w-24 h-px bg-gray-300 relative">
              <FiArrowRight className="absolute -top-1 -right-1 w-3 h-3 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500 mt-1">{getStopsText()}</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(flight.arrival.scheduledTime)}
            </div>
            <div className="text-sm text-gray-600">
              {flight.arrival.airport?.iataCode || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(flight.arrival.scheduledTime)}
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            ${getPrice()}
          </div>
          <div className="text-sm text-gray-500 mb-4">
            per person
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-outline btn-sm"
            >
              {isExpanded ? 'Less Details' : 'More Details'}
            </button>
            <Link
              to={`/flights/${flight._id}/book`}
              state={{ searchParams }}
              className="btn btn-primary btn-sm"
            >
              Select
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
            {/* Flight Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Flight Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Aircraft:</span>
                  <span className="text-gray-900">{flight.aircraft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="text-gray-900">{flight.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Terminal:</span>
                  <span className="text-gray-900">
                    {flight.departure.terminal || 'TBD'} → {flight.arrival.terminal || 'TBD'}
                  </span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {flight.amenities?.map((amenity, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {amenity.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Baggage */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Baggage</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Carry-on:</span>
                  <span className="text-gray-900">
                    {flight.baggage?.carryOn?.weight || '7kg'} 
                    {flight.baggage?.carryOn?.dimensions && ` (${flight.baggage.carryOn.dimensions})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Checked:</span>
                  <span className="text-gray-900">
                    {flight.baggage?.checked?.weight || '23kg'}
                    {flight.baggage?.checked?.price && ` (+$${flight.baggage.checked.price})`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stops Information */}
          {flight.stops && flight.stops.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Stops</h4>
              <div className="space-y-2">
                {flight.stops.map((stop, index) => (
                  <div key={index} className="flex items-center space-x-4 text-sm">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600">
                      {stop.airport?.iataCode || 'Stop'} - 
                      {stop.duration} min layover
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FlightCard;
