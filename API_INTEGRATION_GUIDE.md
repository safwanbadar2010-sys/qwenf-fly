# API Integration Guide - QwenFly Travel Booking Platform

## 🚀 Overview

This guide explains how to use the integrated external APIs for flights and hotels in the QwenFly platform.

## 📋 Table of Contents

- [API Keys Configuration](#api-keys-configuration)
- [Flight API Integration](#flight-api-integration)
- [Hotel API Integration](#hotel-api-integration)
- [API Endpoints](#api-endpoints)
- [Testing the APIs](#testing-the-apis)
- [Deployment Guide](#deployment-guide)

## 🔑 API Keys Configuration

### Environment Variables

The API keys are configured in `server/.env`:

```env
# Flight API
FLIGHT_API_KEY=68fd119661ff8c44dc9282a8
FLIGHT_API_BASE_URL=https://api.flightapi.io

# Hotel API
HOTEL_API_KEY=68fd19f9017cce84938927c8
HOTEL_API_BASE_URL=https://api.makcorps.com
```

**Important:** These keys are already configured and ready to use!

## ✈️ Flight API Integration

### Available Endpoints

#### 1. Search One-Way Flights
```http
GET /api/flights/search?from=HEL&to=OUL&departureDate=2024-05-20&passengers=1&class=Economy&currency=USD
```

**Parameters:**
- `from` (required): Origin airport IATA code
- `to` (required): Destination airport IATA code
- `departureDate` (required): Departure date (YYYY-MM-DD)
- `passengers` (optional): Number of adult passengers (default: 1)
- `children` (optional): Number of children (default: 0)
- `infants` (optional): Number of infants (default: 0)
- `class` (optional): Cabin class (Economy, Business, First) (default: Economy)
- `currency` (optional): Currency code (default: USD)

#### 2. Search Round-Trip Flights
```http
GET /api/flights/search?from=HAN&to=SGN&departureDate=2024-04-10&returnDate=2024-04-12&passengers=1&infants=1&class=Economy&currency=USD
```

**Additional Parameter:**
- `returnDate` (required for round-trip): Return date (YYYY-MM-DD)

#### 3. Multi-City Flight Search
```http
GET /api/flights/multi-city?airports=JAI,DEL,MAA,CCU&dates=2025-06-22,2025-06-28,2025-07-03&adults=1&class=Economy&currency=USD
```

**Parameters:**
- `airports` (required): Comma-separated list of airport codes
- `dates` (required): Comma-separated list of dates
- `adults` (optional): Number of adults (default: 1)
- `children` (optional): Number of children (default: 0)
- `infants` (optional): Number of infants (default: 0)
- `class` (optional): Cabin class (default: Economy)
- `currency` (optional): Currency code (default: USD)

#### 4. Track Flights by Route
```http
GET /api/flights/track?date=2023-07-24&airport1=AMS&airport2=LIS
```

**Parameters:**
- `date` (required): Date to track (YYYY-MM-DD)
- `airport1` (required): First airport IATA code
- `airport2` (required): Second airport IATA code

#### 5. Get Airline Information
```http
GET /api/flights/airline-info?flightNumber=33&airlineCode=DL&date=2023-10-24
```

**Parameters:**
- `flightNumber` (required): Flight number
- `airlineCode` (required): Airline IATA code
- `date` (required): Date (YYYY-MM-DD)

#### 6. Get Flight Schedule
```http
GET /api/flights/schedule?mode=departures&iata=DOH&day=1
```

**Parameters:**
- `mode` (optional): departures or arrivals (default: departures)
- `iata` (required): Airport IATA code
- `day` (optional): Day offset (default: 1)

#### 7. Search IATA Codes
```http
GET /api/flights/search-iata?name=american&type=airline
```

**Parameters:**
- `name` (required): Search query
- `type` (optional): airline or airport (default: airline)

## 🏨 Hotel API Integration

### Available Endpoints

#### 1. Search Hotels by City
```http
GET /api/hotels/search?cityId=60763&checkIn=2023-12-25&checkOut=2023-12-26&rooms=1&guests=2&currency=USD
```

**Parameters:**
- `cityId` (optional): City ID for search
- `city` or `query` (optional): City name or hotel name
- `checkIn` (required): Check-in date (YYYY-MM-DD)
- `checkOut` (required): Check-out date (YYYY-MM-DD)
- `rooms` (optional): Number of rooms (default: 1)
- `guests` (optional): Number of guests (default: 2)
- `children` (optional): Number of children (default: 0)
- `currency` (optional): Currency code (default: USD)

#### 2. Get Hotel Details
```http
GET /api/hotels/4232686?checkIn=2023-12-25&checkOut=2023-12-26&rooms=1&adults=1
```

**Parameters:**
- `hotelId` (required): Hotel ID (in URL path)
- `checkIn` (required): Check-in date (YYYY-MM-DD)
- `checkOut` (required): Check-out date (YYYY-MM-DD)
- `rooms` (optional): Number of rooms (default: 1)
- `adults` (optional): Number of adults (default: 1)
- `children` (optional): Number of children (default: 0)

#### 3. Get Booking Information
```http
GET /api/hotels/booking-info/the-lenox?country=us&checkIn=2024-12-05&checkOut=2024-12-11&rooms=1&adults=2&currency=USD
```

**Parameters:**
- `hotelId` (required): Hotel ID (in URL path)
- `country` (optional): Country code (default: us)
- `checkIn` (required): Check-in date
- `checkOut` (required): Check-out date
- `rooms` (optional): Number of rooms
- `adults` (optional): Number of adults
- `kids` (optional): Number of children
- `currency` (optional): Currency code

#### 4. Get Expedia Hotel Data
```http
GET /api/hotels/expedia/1450057?checkIn=2025-12-10&checkOut=2025-12-11&rooms=1&adults=2&currency=USD
```

**Parameters:**
- `hotelId` (required): Expedia hotel ID
- `checkIn` (required): Check-in date
- `checkOut` (required): Check-out date
- `rooms` (optional): Number of rooms
- `adults` (optional): Number of adults
- `currency` (optional): Currency code

#### 5. Map Hotel Name to ID
```http
GET /api/hotels/map-name?name=the%20lenox
```

**Parameters:**
- `name` (required): Hotel name (URL encoded)

#### 6. Get API Account Info
```http
GET /api/hotels/account
```

**Note:** Requires authentication token

## 🧪 Testing the APIs

### Using cURL (Windows PowerShell)

#### Test Flight Search (One-Way)
```powershell
curl "http://localhost:5000/api/flights/search?from=HEL&to=OUL&departureDate=2024-05-20&passengers=1&class=Economy&currency=USD"
```

#### Test Flight Search (Round-Trip)
```powershell
curl "http://localhost:5000/api/flights/search?from=HAN&to=SGN&departureDate=2024-04-10&returnDate=2024-04-12&passengers=1&infants=1&class=Economy&currency=USD"
```

#### Test Hotel Search
```powershell
curl "http://localhost:5000/api/hotels/search?cityId=60763&checkIn=2023-12-25&checkOut=2023-12-26&rooms=1&guests=2&currency=USD"
```

### Using Postman or Thunder Client

1. Create a new GET request
2. Enter the endpoint URL (e.g., `http://localhost:5000/api/flights/search`)
3. Add query parameters
4. Send the request

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured with the API keys. Verify it exists:

```bash
# Check if .env file exists
ls .env
```

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 🚀 Deployment Guide

### Prerequisites

- Node.js 16+ installed
- MongoDB database (local or cloud)
- API keys configured

### Deployment Platforms

#### 1. Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variables
railway variables set FLIGHT_API_KEY=68fd119661ff8c44dc9282a8
railway variables set HOTEL_API_KEY=68fd19f9017cce84938927c8
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set JWT_SECRET=your_jwt_secret

# Deploy
railway up
```

#### 2. Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables in Render dashboard

#### 3. Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create qwenfly-api

# Set environment variables
heroku config:set FLIGHT_API_KEY=68fd119661ff8c44dc9282a8
heroku config:set HOTEL_API_KEY=68fd19f9017cce84938927c8
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

#### 4. Vercel (Serverless)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables
vercel env add FLIGHT_API_KEY
vercel env add HOTEL_API_KEY
vercel env add MONGODB_URI
vercel env add JWT_SECRET
```

### Environment Variables for Deployment

Ensure these are set on your deployment platform:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_secure_jwt_secret
FLIGHT_API_KEY=68fd119661ff8c44dc9282a8
FLIGHT_API_BASE_URL=https://api.flightapi.io
HOTEL_API_KEY=68fd19f9017cce84938927c8
HOTEL_API_BASE_URL=https://api.makcorps.com
```

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "flights": [...],
    "searchParams": {...},
    "metadata": {
      "total": 25,
      "currency": "USD",
      "timestamp": "2024-01-20T10:30:00.000Z"
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (development only)"
}
```

## 🔧 Troubleshooting

### API Key Issues

- Verify API keys are correctly set in `.env`
- Check if the `.env` file is in the `server` directory
- Restart the server after changing environment variables

### Connection Errors

- Ensure the external APIs are accessible
- Check your internet connection
- Verify firewall settings

### Rate Limiting

- Both APIs have rate limits
- Implement caching for frequently requested data
- Consider upgrading API plans if needed

## 📞 Support

For issues or questions:
- Check API documentation: 
  - Flight API: https://api.flightapi.io
  - Hotel API: https://api.makcorps.com
- Review error messages in server logs
- Test individual endpoints using the examples above

## 🎯 Next Steps

1. ✅ APIs are integrated and ready to use
2. ✅ Environment variables are configured
3. ⏭️ Test the endpoints locally
4. ⏭️ Update frontend to consume these APIs
5. ⏭️ Deploy to your preferred platform
6. ⏭️ Monitor API usage and performance

---

**Ready to Deploy!** 🚀

All APIs are integrated and configured. Simply start your server and begin testing!
