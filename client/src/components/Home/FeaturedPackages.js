import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiUsers, FiArrowRight } from 'react-icons/fi';

const FeaturedPackages = () => {
  const packages = [
    {
      id: 1,
      name: 'European Adventure',
      destination: 'Paris, Rome, Barcelona',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=500',
      duration: '10 days',
      price: 1299,
      originalPrice: 1599,
      rating: 4.8,
      travelers: 25,
      category: 'Cultural',
      description: 'Explore the best of Europe with this comprehensive tour',
      features: ['Flights Included', '4-Star Hotels', 'Guided Tours', 'Breakfast']
    },
    {
      id: 2,
      name: 'Tropical Paradise',
      destination: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500',
      duration: '7 days',
      price: 899,
      originalPrice: 1199,
      rating: 4.9,
      travelers: 18,
      category: 'Beach',
      description: 'Relax and unwind in the beautiful beaches of Bali',
      features: ['Resort Stay', 'Spa Treatments', 'Island Tours', 'All Meals']
    },
    {
      id: 3,
      name: 'Mountain Explorer',
      destination: 'Swiss Alps',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      duration: '8 days',
      price: 1499,
      originalPrice: 1799,
      rating: 4.7,
      travelers: 12,
      category: 'Adventure',
      description: 'Experience the breathtaking beauty of the Swiss Alps',
      features: ['Mountain Hiking', 'Cable Car Rides', 'Local Cuisine', 'Equipment']
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Travel Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked experiences that combine the best destinations, activities, and accommodations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card card-hover overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {pkg.category}
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
                    <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {pkg.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiUsers className="w-4 h-4" />
                      <span>{pkg.travelers} travelers</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">What's Included:</h4>
                    <div className="flex flex-wrap gap-2">
                      {pkg.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ${pkg.price}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${pkg.originalPrice}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">per person</span>
                    </div>
                    <Link
                      to={`/packages/${pkg.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/packages"
              className="btn btn-primary btn-lg"
            >
              View All Packages
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
