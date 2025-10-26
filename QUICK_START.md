# 🚀 QwenFly Quick Start Guide

## ✅ What's Ready

Your QwenFly travel booking platform is now integrated with:
- ✈️ **Flight API** - Real-time flight search and booking
- 🏨 **Hotel API** - Hotel search and reservations
- 🔑 **API Keys Configured** - Ready to use immediately

## 📋 Prerequisites

- Node.js 16+ installed
- npm package manager
- MongoDB (optional - can use MongoDB Atlas)

## 🏃 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
# Navigate to server directory
cd server

# Install all dependencies
npm install
```

### Step 2: Verify Configuration

The `.env` file is already configured with API keys. Just verify:

```bash
# Check if .env exists
dir .env
```

**✓ API Keys Already Configured:**
- Flight API: `68fd119661ff8c44dc9282a8`
- Hotel API: `68fd19f9017cce84938927c8`

### Step 3: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

**Server will start on:** `http://localhost:5000`

## 🧪 Test the APIs

### Option 1: Run Automated Tests

```bash
npm run test:api
```

This will test all API endpoints and show you the results.

### Option 2: Manual Testing with cURL

#### Test Flight Search
```powershell
curl "http://localhost:5000/api/flights/search?from=NYC&to=LAX&departureDate=2024-06-15&passengers=1&class=Economy&currency=USD"
```

#### Test Hotel Search
```powershell
curl "http://localhost:5000/api/hotels/search?cityId=60763&checkIn=2024-06-15&checkOut=2024-06-16&rooms=1&guests=2&currency=USD"
```

### Option 3: Use API Testing Tools

**Postman/Thunder Client:**
1. Create new GET request
2. URL: `http://localhost:5000/api/flights/search`
3. Add query parameters:
   - `from`: NYC
   - `to`: LAX
   - `departureDate`: 2024-06-15
   - `passengers`: 1
   - `class`: Economy
   - `currency`: USD
4. Send request

## 📚 Available Endpoints

### ✈️ Flight Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /api/flights/search` | Search flights | `?from=NYC&to=LAX&departureDate=2024-06-15` |
| `GET /api/flights/multi-city` | Multi-city search | `?airports=NYC,LAX,SFO&dates=2024-06-15,2024-06-20` |
| `GET /api/flights/track` | Track flights | `?date=2024-06-15&airport1=NYC&airport2=LAX` |
| `GET /api/flights/schedule` | Airport schedule | `?iata=JFK&mode=departures` |
| `GET /api/flights/search-iata` | Search IATA codes | `?name=american&type=airline` |

### 🏨 Hotel Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /api/hotels/search` | Search hotels | `?cityId=60763&checkIn=2024-06-15&checkOut=2024-06-16` |
| `GET /api/hotels/:id` | Hotel details | `/4232686?checkIn=2024-06-15&checkOut=2024-06-16` |
| `GET /api/hotels/booking-info/:id` | Booking info | `/the-lenox?checkIn=2024-06-15&checkOut=2024-06-16` |
| `GET /api/hotels/map-name` | Map hotel name | `?name=the%20lenox` |

## 🎯 Next Steps

### 1. Update Frontend (Optional)

If you want to connect the frontend:

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Update API URL in .env file
echo REACT_APP_API_URL=http://localhost:5000/api > .env

# Start frontend
npm start
```

Frontend will run on: `http://localhost:3000`

### 2. Deploy to Production

Choose your platform:

#### **Railway** (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### **Render**
- Push code to GitHub
- Connect repository in Render dashboard
- Environment variables are already in `render.yaml`

#### **Heroku**
```bash
heroku create qwenfly-api
git push heroku main
```

## 📖 Documentation

- **Full API Guide:** See `API_INTEGRATION_GUIDE.md`
- **Deployment Details:** See `API_INTEGRATION_GUIDE.md` (Deployment section)

## 🔧 Troubleshooting

### Server won't start?
```bash
# Check if port 5000 is available
netstat -ano | findstr :5000

# Use different port
set PORT=3001
npm start
```

### API returns errors?
```bash
# Verify API keys
cat .env | findstr API_KEY

# Check server logs
npm run dev
```

### Database connection issues?
```bash
# Use MongoDB Atlas (free tier)
# Update MONGODB_URI in .env file
```

## 💡 Tips

1. **API Rate Limits:** Be mindful of API rate limits in production
2. **Caching:** Consider implementing caching for frequently searched routes
3. **Error Handling:** All errors are logged for debugging
4. **Security:** API keys are in `.env` - never commit this file to Git

## 🎉 You're Ready!

Your backend is now fully integrated with external Flight and Hotel APIs!

**Test it now:**
```bash
npm run test:api
```

For detailed API documentation, see `API_INTEGRATION_GUIDE.md`

---

**Questions?** Check the logs or refer to the full documentation.
