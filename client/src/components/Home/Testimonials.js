import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Amazing experience! The booking process was so smooth and the customer service was exceptional. I will definitely use this platform again for my future travels.',
      trip: 'European Adventure Package',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'The flight booking was seamless and the hotel recommendations were perfect. Everything was exactly as described. Highly recommended!',
      trip: 'Business Trip to London',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      location: 'Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'I booked a complete travel package and everything was perfectly organized. The local guides were knowledgeable and the accommodations were top-notch.',
      trip: 'Tropical Paradise in Bali',
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'David Thompson',
      location: 'Melbourne, Australia',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Outstanding service from start to finish. The cab booking was reliable and the driver was professional. Will definitely book again.',
      trip: 'City Tour with Cab Service',
      date: '1 week ago'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      location: 'Singapore',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'The mountain adventure package exceeded all my expectations. The itinerary was well-planned and the activities were thrilling. Perfect for adventure seekers!',
      trip: 'Mountain Explorer in Swiss Alps',
      date: '2 months ago'
    },
    {
      id: 6,
      name: 'James Wilson',
      location: 'London, UK',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Excellent platform with great deals. The hotel booking was straightforward and the property was exactly as shown. Great value for money!',
      trip: 'Weekend Getaway in Paris',
      date: '3 days ago'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real experiences from real travelers who have explored the world with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative group"
              >
                <div className="absolute top-4 right-4 text-blue-100 group-hover:text-blue-200 transition-colors">
                  <FaQuoteLeft className="w-8 h-8" />
                </div>
                
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-100"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">{testimonial.date}</span>
                </div>
                
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-600 font-medium">
                    {testimonial.trip}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <FaUser className="w-3 h-3 mr-1" />
                    <span>Verified Traveler</span>
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 max-w-4xl mx-auto text-white">
              <h3 className="text-2xl font-bold mb-4">
                Join Our Community of Happy Travelers
              </h3>
              <p className="text-lg text-blue-100 mb-6">
                Over 50,000 travelers have trusted us with their journeys. Be part of our success story.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Start Your Journey
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Read More Reviews
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;