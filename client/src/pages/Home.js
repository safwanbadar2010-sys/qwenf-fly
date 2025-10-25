import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi';
import { FaPlane, FaHotel, FaCar, FaBox, FaGlobe, FaHeart, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import SearchForm from '../components/Search/SearchForm';
import PopularDestinations from '../components/Home/PopularDestinations';
import FeaturedPackages from '../components/Home/FeaturedPackages';
import Testimonials from '../components/Home/Testimonials';
import Stats from '../components/Home/Stats';

const Home = () => {
  const [activeTab, setActiveTab] = useState('flights');

  const services = [
    {
      id: 'flights',
      name: 'Flights',
      icon: FaPlane,
      description: 'Find and book flights to destinations worldwide',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/flights'
    },
    {
      id: 'hotels',
      name: 'Hotels',
      icon: FaHotel,
      description: 'Discover amazing hotels and accommodations',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/hotels'
    },
    {
      id: 'cabs',
      name: 'Cabs',
      icon: FaCar,
      description: 'Book reliable transportation services',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      link: '/cabs'
    },
    {
      id: 'packages',
      name: 'Packages',
      icon: FaBox,
      description: 'Complete travel packages with everything included',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      link: '/packages'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000"></div>
        </div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Your Gateway to the
              <span className="text-yellow-400"> World</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-blue-100"
            >
              Book flights, hotels, cabs, and travel packages all in one place
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.id}
                    to={service.link}
                    className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-opacity-30 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{service.name}</span>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Section */}
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
                Start Your Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Search and book your perfect travel experience with our comprehensive booking platform
              </p>
            </motion.div>

            <SearchForm />
          </div>
        </div>
      </section>

      {/* Services Section */}
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
                Our Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need for your perfect trip
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="card card-hover p-6 text-center group"
                  >
                    <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <Link
                      to={service.link}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Learn More
                      <FiArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <PopularDestinations />

      {/* Featured Packages */}
      <FeaturedPackages />

      {/* Stats Section */}
      <Stats />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who have booked their perfect trips with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/flights"
                className="btn bg-white text-blue-600 hover:bg-gray-100"
              >
                <FiPlane className="w-5 h-5" />
                Book a Flight
              </Link>
              <Link
                to="/packages"
                className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                <FiPackage className="w-5 h-5" />
                View Packages
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
