import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar } from 'react-icons/fi';

const PopularDestinations = () => {
  const destinations = [
    {
      id: 1,
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop&crop=center',
      price: 299,
      rating: 4.8,
      description: 'The City of Light',
      attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame']
    },
    {
      id: 2,
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop&crop=center',
      price: 599,
      rating: 4.9,
      description: 'Modern metropolis meets ancient tradition',
      attractions: ['Tokyo Tower', 'Senso-ji Temple', 'Shibuya Crossing']
    },
    {
      id: 3,
      name: 'New York',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop&crop=center',
      price: 399,
      rating: 4.7,
      description: 'The Big Apple',
      attractions: ['Statue of Liberty', 'Central Park', 'Times Square']
    },
    {
      id: 4,
      name: 'London',
      country: 'UK',
      image: 'https://images.unsplash.com/photo-1513639769931-4c4b4a5b5b5b?w=600&h=400&fit=crop&crop=center',
      price: 349,
      rating: 4.6,
      description: 'Historic and vibrant',
      attractions: ['Big Ben', 'Tower Bridge', 'Buckingham Palace']
    },
    {
      id: 5,
      name: 'Dubai',
      country: 'UAE',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea2fbec9b90?w=600&h=400&fit=crop&crop=center',
      price: 499,
      rating: 4.8,
      description: 'Luxury and innovation',
      attractions: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall']
    },
    {
      id: 6,
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop&crop=center',
      price: 199,
      rating: 4.9,
      description: 'Tropical paradise',
      attractions: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Kuta Beach']
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing places around the world that our travelers love
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card card-hover overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
                    <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{destination.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiMapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{destination.country}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {destination.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {destination.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-600">
                      ${destination.price}
                      <span className="text-sm font-normal text-gray-500">/person</span>
                    </div>
                    <Link
                      to={`/hotels?city=${destination.name}`}
                      className="btn btn-outline btn-sm"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/hotels"
              className="btn btn-primary btn-lg"
            >
              View All Destinations
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
