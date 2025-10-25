import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiClock, FiUsers, FiArrowRight, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PackageCard = ({ package: pkg, searchParams }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryIcon = (category) => {
    const iconMap = {
      adventure: '🏔️',
      cultural: '🏛️',
      beach: '🏖️',
      mountain: '⛰️',
      city: '🏙️',
      wildlife: '🦁',
      religious: '🕍',
      honeymoon: '💕',
      family: '👨‍👩‍👧‍👦',
      luxury: '💎',
      budget: '💰'
    };
    return iconMap[category] || '✈️';
  };

  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      easy: 'text-green-600 bg-green-100',
      moderate: 'text-yellow-600 bg-yellow-100',
      challenging: 'text-orange-600 bg-orange-100',
      extreme: 'text-red-600 bg-red-100'
    };
    return colorMap[difficulty] || 'text-gray-600 bg-gray-100';
  };

  const getAdultPrice = () => {
    return pkg.pricing.adult?.total || pkg.pricing.adult?.basePrice || 0;
  };

  const getChildPrice = () => {
    return pkg.pricing.child?.total || pkg.pricing.child?.basePrice || 0;
  };

  const getInfantPrice = () => {
    return pkg.pricing.infant?.total || pkg.pricing.infant?.basePrice || 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover overflow-hidden"
    >
      <div className="md:flex">
        {/* Package Image */}
        <div className="md:w-80 h-48 md:h-auto">
          <img
            src={pkg.images?.[0]?.url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Package Info */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{getCategoryIcon(pkg.category)}</span>
                <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
              </div>
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1 text-gray-600">
                  <FiMapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {pkg.destination.city}, {pkg.destination.country}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <FiClock className="w-4 h-4" />
                  <span className="text-sm">
                    {pkg.duration.days} days, {pkg.duration.nights} nights
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <FiUsers className="w-4 h-4" />
                  <span className="text-sm">
                    {pkg.groupSize.min}-{pkg.groupSize.max} people
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {pkg.shortDescription || pkg.description}
              </p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    {pkg.averageRating?.toFixed(1) || '4.5'}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({pkg.totalReviews || 0} reviews)
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(pkg.difficulty)}`}>
                  {pkg.difficulty}
                </span>
                {pkg.isFeatured && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                ${getAdultPrice()}
              </div>
              <div className="text-sm text-gray-500 mb-4">per adult</div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="btn btn-outline btn-sm"
                >
                  {isExpanded ? 'Less Details' : 'More Details'}
                </button>
                <Link
                  to={`/packages/${pkg._id}/book`}
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
              className="border-t border-gray-200 pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Itinerary */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Itinerary</h4>
                  <div className="space-y-3">
                    {pkg.itinerary?.slice(0, 3).map((day, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {day.day}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{day.title}</div>
                          <div className="text-sm text-gray-600">{day.description}</div>
                        </div>
                      </div>
                    ))}
                    {pkg.itinerary?.length > 3 && (
                      <div className="text-sm text-blue-600">
                        +{pkg.itinerary.length - 3} more days
                      </div>
                    )}
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                  <div className="space-y-2">
                    {pkg.inclusions?.slice(0, 6).map((inclusion, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FiCheck className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">
                          {inclusion.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                    {pkg.inclusions?.length > 6 && (
                      <div className="text-sm text-blue-600">
                        +{pkg.inclusions.length - 6} more inclusions
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Details */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Adult</div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${getAdultPrice()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Child (2-11)</div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${getChildPrice()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Infant (0-1)</div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${getInfantPrice()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Time to Visit */}
              {pkg.bestTimeToVisit && pkg.bestTimeToVisit.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Best Time to Visit</h4>
                  <div className="flex flex-wrap gap-2">
                    {pkg.bestTimeToVisit.map((time, index) => (
                      <span
                        key={index}
                        className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
