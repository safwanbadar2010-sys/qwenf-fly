import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  profile: '/auth/profile',
  changePassword: '/auth/change-password',
  
  // Flights
  airports: '/flights/airports',
  flightSearch: '/flights/search',
  flightDetails: '/flights',
  flightBook: '/flights/book',
  airlines: '/flights/airlines',
  popularRoutes: '/flights/popular-routes',
  
  // Hotels
  hotelSearch: '/hotels/search',
  hotelDetails: '/hotels',
  hotelBook: '/hotels/book',
  hotelReview: '/hotels',
  popularDestinations: '/hotels/popular-destinations',
  hotelAmenities: '/hotels/amenities',
  
  // Cabs
  cabSearch: '/cabs/search',
  cabDetails: '/cabs',
  cabBook: '/cabs/book',
  vehicleTypes: '/cabs/vehicle-types',
  cabAmenities: '/cabs/amenities',
  
  // Packages
  packageSearch: '/packages/search',
  packageDetails: '/packages',
  packageBook: '/packages/book',
  packageReview: '/packages',
  packageCategories: '/packages/categories',
  featuredPackages: '/packages/featured',
  popularPackageDestinations: '/packages/popular-destinations',
  
  // Bookings
  bookings: '/bookings',
  bookingDetails: '/bookings',
  cancelBooking: '/bookings',
  
  // Payments
  createPaymentIntent: '/payments/create-payment-intent',
  confirmPayment: '/payments/confirm-payment',
  refund: '/payments/refund',
  paymentMethods: '/payments/methods',
  paymentHistory: '/payments/history'
};

export default api;
