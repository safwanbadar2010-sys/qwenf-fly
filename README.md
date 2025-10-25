# Travel Booking Platform

A comprehensive travel booking platform with flight, hotel, cab, and package booking features. Built with React, Node.js, Express, and MongoDB.

## Features

### 🛫 Flight Booking
- Search flights by route, date, and passengers
- Real-time flight availability
- Seat selection and meal preferences
- Multiple airline support
- Price comparison

### 🏨 Hotel Booking
- Search hotels by location and dates
- Room type selection
- Guest capacity management
- Hotel amenities and reviews
- Star rating filters

### 🚗 Cab Booking
- Real-time cab availability
- Multiple vehicle types (Sedan, SUV, Luxury, Minivan)
- Driver information and ratings
- Distance and fare calculation
- Pickup and dropoff location selection

### 📦 Travel Packages
- Complete travel packages with itineraries
- Multiple categories (Adventure, Cultural, Beach, etc.)
- Group size management
- Package inclusions and exclusions
- Duration-based filtering

### 💳 Payment Integration
- Stripe payment processing
- Multiple payment methods
- Secure transaction handling
- Refund management
- Payment history

### 👤 User Management
- User registration and authentication
- Profile management
- Booking history
- Loyalty points system
- Password management

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React 18** - UI library
- **React Router** - Routing
- **React Query** - Data fetching
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Tailwind CSS** - Styling

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the project root directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/travel-booking
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Flights
- `GET /api/flights/airports` - Search airports
- `GET /api/flights/search` - Search flights
- `GET /api/flights/:id` - Get flight details
- `POST /api/flights/book` - Book a flight
- `GET /api/flights/airlines` - Get airlines
- `GET /api/flights/popular-routes` - Get popular routes

### Hotels
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels/book` - Book a hotel
- `POST /api/hotels/:id/reviews` - Add hotel review
- `GET /api/hotels/popular-destinations` - Get popular destinations
- `GET /api/hotels/amenities` - Get amenities

### Cabs
- `GET /api/cabs/search` - Search cabs
- `GET /api/cabs/:id` - Get cab details
- `POST /api/cabs/book` - Book a cab
- `GET /api/cabs/vehicle-types` - Get vehicle types
- `GET /api/cabs/amenities` - Get amenities

### Packages
- `GET /api/packages/search` - Search packages
- `GET /api/packages/:id` - Get package details
- `POST /api/packages/book` - Book a package
- `POST /api/packages/:id/reviews` - Add package review
- `GET /api/packages/categories` - Get categories
- `GET /api/packages/featured` - Get featured packages
- `GET /api/packages/popular-destinations` - Get popular destinations

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/stats/summary` - Get booking statistics

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/methods` - Get payment methods
- `GET /api/payments/history` - Get payment history

## Database Schema

### User Model
- Personal information (name, email, phone, date of birth, gender)
- Authentication (password, JWT tokens)
- Preferences (seat preference, meal preference, newsletter)
- Loyalty points and booking history

### Flight Model
- Flight details (number, airline, aircraft)
- Departure and arrival information
- Pricing for different classes
- Seat availability and amenities
- Baggage information

### Hotel Model
- Hotel information (name, description, address)
- Star rating and amenities
- Room types and pricing
- Policies and reviews
- Images and facilities

### Cab Model
- Vehicle information (type, make, model, year)
- Driver details and ratings
- Pricing structure
- Availability and location
- Amenities and capacity

### Package Model
- Package details (name, description, destination)
- Duration and itinerary
- Pricing for different traveler types
- Inclusions and exclusions
- Category and difficulty level

### Booking Model
- Booking information (ID, type, status)
- Service-specific details
- Pricing breakdown
- Payment information
- Cancellation details

## Deployment

### Using Docker

1. Create a `docker-compose.yml` file:
   ```yaml
   version: '3.8'
   services:
     mongodb:
       image: mongo:latest
       ports:
         - "27017:27017"
       environment:
         MONGO_INITDB_ROOT_USERNAME: admin
         MONGO_INITDB_ROOT_PASSWORD: password
     
     backend:
       build: .
       ports:
         - "5000:5000"
       environment:
         MONGODB_URI: mongodb://admin:password@mongodb:27017/travel-booking
         JWT_SECRET: your_jwt_secret
         STRIPE_SECRET_KEY: your_stripe_secret_key
       depends_on:
         - mongodb
     
     frontend:
       build: ./client
       ports:
         - "3000:3000"
       environment:
         REACT_APP_API_URL: http://localhost:5000/api
       depends_on:
         - backend
   ```

2. Build and start the services:
   ```bash
   docker-compose up --build
   ```

### Using Heroku

1. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Add MongoDB Atlas or mLab addon:
   ```bash
   heroku addons:create mongolab:sandbox
   ```

3. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set STRIPE_SECRET_KEY=your_stripe_secret_key
   heroku config:set NODE_ENV=production
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

### Using Vercel (Frontend)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy the frontend:
   ```bash
   cd client
   vercel
   ```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/travel-booking
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@travelbooking.com or create an issue in the repository.

## Roadmap

- [ ] Mobile app development
- [ ] Advanced search filters
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] API rate limiting
- [ ] Caching implementation
- [ ] Performance optimization
- [ ] Security enhancements
