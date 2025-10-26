# QwenFly Backend API

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Test API connection
npm run test:connection

# Start server
npm start
```

Server runs on: `http://localhost:5000`

## 📡 API Status

✅ **Flight API:** Connected  
✅ **Hotel API:** Connected  
✅ **Server:** Running  

## 🔑 Environment Variables

All configured in `.env` file:
- ✅ Flight API Key
- ✅ Hotel API Key
- ✅ JWT Secret
- ✅ MongoDB URI

## 📚 Documentation

See project root for:
- `API_INTEGRATION_GUIDE.md` - Complete API documentation
- `QUICK_START.md` - Setup guide
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide
- `INTEGRATION_SUMMARY.md` - Overview

## 🧪 Testing

```bash
# Test API connections
npm run test:connection

# Test all APIs
npm run test:api
```

## 🌐 Endpoints

### Flight API
- `GET /api/flights/search` - Search flights
- `GET /api/flights/multi-city` - Multi-city search
- `GET /api/flights/track` - Track flights
- Plus 6 more endpoints...

### Hotel API
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Hotel details
- `GET /api/hotels/booking-info/:id` - Booking info
- Plus 5 more endpoints...

## 🚀 Deploy

```bash
# Railway
railway up

# Heroku
git push heroku main

# Render
# See render.yaml
```

## 📞 Support

Check documentation files in project root for detailed guides.
