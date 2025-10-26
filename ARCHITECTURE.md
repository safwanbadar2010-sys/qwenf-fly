# 🏗️ QwenFly System Architecture

## Overview

QwenFly is a full-stack travel booking platform integrated with external Flight and Hotel APIs.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    FRONTEND (React)                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  - React 18                                              │   │
│  │  - React Router (Navigation)                             │   │
│  │  - React Query (Data Fetching)                           │   │
│  │  - Tailwind CSS (Styling)                                │   │
│  │  - Framer Motion (Animations)                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                     Deployed on: Vercel/Netlify                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ REST API
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    BACKEND API (Node.js/Express)                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API Routes                            │   │
│  │  ┌────────┬────────┬────────┬────────┬────────┬──────┐  │   │
│  │  │Flights │Hotels  │Cabs    │Packages│Bookings│Auth  │  │   │
│  │  └────────┴────────┴────────┴────────┴────────┴──────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Service Layer                           │   │
│  │  ┌─────────────────────┬─────────────────────────────┐  │   │
│  │  │ flightApiService.js │ hotelApiService.js          │  │   │
│  │  └─────────────────────┴─────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Middleware                              │   │
│  │  - Authentication (JWT)                                  │   │
│  │  - Rate Limiting                                         │   │
│  │  - CORS                                                  │   │
│  │  - Error Handling                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│                  Deployed on: Railway/Render/Heroku              │
└──────────┬────────────────────────┬──────────────────────────────┘
           │                        │
           │                        │
    ┌──────▼──────┐          ┌──────▼──────────────────────────┐
    │             │          │                                  │
    │  MongoDB    │          │  External APIs                   │
    │  Database   │          │                                  │
    │             │          │  ┌────────────────────────────┐  │
    │  - Users    │          │  │ Flight API                 │  │
    │  - Bookings │          │  │ (api.flightapi.io)         │  │
    │  - Hotels   │          │  │ - One-way search           │  │
    │  - Flights  │          │  │ - Round-trip search        │  │
    │  - Cabs     │          │  │ - Multi-city search        │  │
    │  - Packages │          │  │ - Flight tracking          │  │
    │             │          │  │ - Schedules                │  │
    │  Atlas      │          │  │ - IATA search              │  │
    │  (Cloud)    │          │  └────────────────────────────┘  │
    │             │          │                                  │
    └─────────────┘          │  ┌────────────────────────────┐  │
                             │  │ Hotel API                  │  │
                             │  │ (api.makcorps.com)         │  │
                             │  │ - City search              │  │
                             │  │ - Hotel details            │  │
                             │  │ - Booking info             │  │
                             │  │ - Expedia integration      │  │
                             │  │ - Name mapping             │  │
                             │  └────────────────────────────┘  │
                             │                                  │
                             └──────────────────────────────────┘
```

## Data Flow

### Flight Search Flow

```
User Input
   │
   ├─► Frontend (React)
   │      │
   │      ├─► API Request to Backend
   │            │
   │            ├─► flights.js Route
   │                  │
   │                  ├─► flightApiService.js
   │                        │
   │                        ├─► External Flight API
   │                        │     (api.flightapi.io)
   │                        │
   │                        ├─► Response Processing
   │                        │
   │                        └─► Formatted Data
   │                              │
   │                              ├─► Backend Response
   │                                    │
   │                                    └─► Frontend Display
```

### Hotel Search Flow

```
User Input
   │
   ├─► Frontend (React)
   │      │
   │      ├─► API Request to Backend
   │            │
   │            ├─► hotels.js Route
   │                  │
   │                  ├─► hotelApiService.js
   │                        │
   │                        ├─► External Hotel API
   │                        │     (api.makcorps.com)
   │                        │
   │                        ├─► Response Processing
   │                        │
   │                        └─► Formatted Data
   │                              │
   │                              ├─► Backend Response
   │                                    │
   │                                    └─► Frontend Display
```

### Booking Flow

```
User Booking Request
   │
   ├─► Frontend (React)
   │      │
   │      ├─► Authentication Check
   │            │
   │            ├─► API Request to Backend
   │                  │
   │                  ├─► Auth Middleware (JWT)
   │                        │
   │                        ├─► bookings.js Route
   │                              │
   │                              ├─► Create Booking in MongoDB
   │                              │
   │                              ├─► Update Availability
   │                              │
   │                              ├─► Payment Processing (Stripe)
   │                              │
   │                              └─► Confirmation Response
   │                                    │
   │                                    └─► Frontend Confirmation
```

## Technology Stack

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **State Management:** React Query + Context API
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Build Tool:** Create React App / Vite

### Backend
- **Runtime:** Node.js 16+
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Express Validator
- **Security:** Helmet, CORS, Rate Limiting
- **API Client:** Axios
- **Environment:** dotenv

### External Services
- **Flight Data:** FlightAPI.io
- **Hotel Data:** MakCorps API
- **Payments:** Stripe
- **Email:** Nodemailer (SMTP)
- **Storage:** Cloudinary (images)

### DevOps & Deployment
- **Version Control:** Git
- **Hosting Options:**
  - Backend: Railway / Render / Heroku
  - Frontend: Vercel / Netlify
  - Database: MongoDB Atlas
- **Containerization:** Docker (optional)
- **CI/CD:** GitHub Actions (optional)

## Security Features

### Backend Security
1. **Authentication**
   - JWT tokens with expiration
   - Password hashing (bcrypt)
   - Protected routes

2. **API Security**
   - Rate limiting (prevent abuse)
   - CORS configuration
   - Helmet (HTTP headers)
   - Input validation

3. **Environment**
   - Environment variables for secrets
   - API keys secured
   - Production/development modes

### Frontend Security
1. **Authentication**
   - Token storage (localStorage/cookies)
   - Protected routes
   - Auto logout on expiry

2. **Data Validation**
   - Client-side validation
   - Server-side verification
   - XSS prevention

## API Integration Architecture

### Flight API Integration

```
┌─────────────────────────────────────────────┐
│        flightApiService.js                   │
├─────────────────────────────────────────────┤
│                                              │
│  Methods:                                    │
│  ├─ searchOneWay()                          │
│  ├─ searchRoundTrip()                       │
│  ├─ searchMultiCity()                       │
│  ├─ getAirlineInfo()                        │
│  ├─ trackByRoute()                          │
│  ├─ searchIATA()                            │
│  └─ getSchedule()                           │
│                                              │
│  Features:                                   │
│  ├─ Error handling                          │
│  ├─ Response formatting                     │
│  ├─ Timeout management                      │
│  └─ API key management                      │
│                                              │
└─────────────────────────────────────────────┘
```

### Hotel API Integration

```
┌─────────────────────────────────────────────┐
│        hotelApiService.js                    │
├─────────────────────────────────────────────┤
│                                              │
│  Methods:                                    │
│  ├─ searchByCity()                          │
│  ├─ getHotelDetails()                       │
│  ├─ getBookingInfo()                        │
│  ├─ getExpediaHotel()                       │
│  ├─ mapHotelName()                          │
│  ├─ getAccountInfo()                        │
│  └─ searchHotels()                          │
│                                              │
│  Features:                                   │
│  ├─ Error handling                          │
│  ├─ Response formatting                     │
│  ├─ Timeout management                      │
│  └─ API key management                      │
│                                              │
└─────────────────────────────────────────────┘
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  password: String (hashed),
  phone: String,
  role: String (user/admin),
  loyaltyPoints: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  bookingId: String (unique),
  user: ObjectId (ref: User),
  type: String (flight/hotel/cab/package),
  status: String (pending/confirmed/cancelled),
  pricing: {
    basePrice: Number,
    taxes: Number,
    fees: Number,
    total: Number,
    currency: String
  },
  flight: { /* flight details */ },
  hotel: { /* hotel details */ },
  paymentStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Performance Optimization

### Caching Strategy (Future Enhancement)
- Cache popular flight routes
- Cache hotel search results
- Redis for session management
- CDN for static assets

### Database Optimization
- Indexed fields (email, bookingId)
- Compound indexes for queries
- Connection pooling
- Query optimization

## Monitoring & Logging

### Recommended Setup
1. **Error Tracking:** Sentry
2. **Performance:** New Relic / DataDog
3. **Uptime:** UptimeRobot
4. **Logs:** Winston / Morgan
5. **Analytics:** Google Analytics

## Scalability Considerations

### Horizontal Scaling
- Stateless backend design
- Load balancer ready
- Database replication
- Microservices ready

### Vertical Scaling
- Resource optimization
- Query optimization
- Connection pooling
- Memory management

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────┐
│          Load Balancer                       │
│          (Railway/Render/Heroku)             │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
   ┌────▼────┐   ┌───▼────┐
   │ API     │   │ API    │
   │ Server  │   │ Server │
   │ Instance│   │Instance│
   └────┬────┘   └───┬────┘
        │            │
        └─────┬──────┘
              │
        ┌─────▼─────┐
        │ MongoDB   │
        │ Atlas     │
        │ (Replica  │
        │  Set)     │
        └───────────┘
```

## API Rate Limits

### External APIs
- **Flight API:** Check provider limits
- **Hotel API:** Check provider limits

### Backend API
- Rate limiting: 100 requests/15 minutes per IP
- Authenticated users: Higher limits
- Admin users: Unlimited

## Environment Variables

### Required
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Authentication secret
- `FLIGHT_API_KEY` - Flight API key
- `HOTEL_API_KEY` - Hotel API key

### Optional
- `STRIPE_SECRET_KEY` - Payment processing
- `EMAIL_HOST` - Email notifications
- `CLOUDINARY_API_KEY` - Image storage

## Backup & Recovery

### Database Backup
- MongoDB Atlas automatic backups
- Point-in-time recovery
- Daily snapshots

### Code Backup
- Git version control
- GitHub repository
- Deployment rollback capability

## Testing Strategy

### Backend Testing
- Unit tests for services
- Integration tests for routes
- API connection tests
- Load testing

### Frontend Testing
- Component tests
- E2E tests (Cypress/Playwright)
- User flow testing

## Future Enhancements

1. **Caching Layer**
   - Redis for frequently accessed data
   - CDN for static assets

2. **Microservices**
   - Separate flight service
   - Separate hotel service
   - API gateway

3. **Real-time Features**
   - WebSocket for live updates
   - Push notifications
   - Live chat support

4. **Advanced Features**
   - Machine learning for recommendations
   - Price prediction
   - Smart notifications

---

**Architecture Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready
