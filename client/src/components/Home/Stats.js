import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaPlane, FaGlobe, FaStar, FaHeart, FaShieldAlt } from 'react-icons/fa';

const Stats = () => {
  const stats = [
    {
      icon: FaUsers,
      number: '50,000+',
      label: 'Happy Travelers',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Join thousands of satisfied customers'
    },
    {
      icon: FaPlane,
      number: '1,000+',
      label: 'Flights Booked',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Successful flight bookings'
    },
    {
      icon: FaGlobe,
      number: '150+',
      label: 'Destinations',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Countries and cities worldwide'
    },
    {
      icon: FaStar,
      number: '4.9/5',
      label: 'Customer Rating',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Based on 10,000+ reviews'
    },
    {
      icon: FaHeart,
      number: '99%',
      label: 'Satisfaction Rate',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Customer satisfaction guaranteed'
    },
    {
      icon: FaShieldAlt,
      number: '24/7',
      label: 'Support',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'Round-the-clock assistance'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-400/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-white/10 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse delay-3000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Travelers Worldwide
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made their travel dreams come true
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-blue-100">
                    {stat.description}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="w-5 h-5" />
                <span className="text-sm">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaHeart className="w-5 h-5" />
                <span className="text-sm">Customer First</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaStar className="w-5 h-5" />
                <span className="text-sm">Premium Service</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Stats;