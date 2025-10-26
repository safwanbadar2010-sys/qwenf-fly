# 🚀 Deployment Checklist - QwenFly

## ✅ Pre-Deployment Verification

### 1. Local Testing Complete
- [x] APIs are integrated (Flight & Hotel)
- [x] API keys are configured
- [x] Connection test passed
- [x] Server starts successfully
- [x] Endpoints return data

### 2. Code Quality
- [x] All routes updated with external APIs
- [x] Service layer created for API calls
- [x] Error handling implemented
- [x] Environment variables configured

## 📦 What's Included

### Backend Services
```
server/
├── services/
│   ├── flightApiService.js   ✅ Complete
│   └── hotelApiService.js    ✅ Complete
├── routes/
│   ├── flights.js            ✅ Updated with API integration
│   ├── hotels.js             ✅ Updated with API integration
│   ├── auth.js               ✅ Ready
│   ├── cabs.js               ✅ Ready
│   ├── packages.js           ✅ Ready
│   ├── bookings.js           ✅ Ready
│   └── payments.js           ✅ Ready
├── .env                      ✅ Configured with API keys
└── index.js                  ✅ Ready
```

### API Keys (Already Configured)
- ✅ Flight API: `68fd119661ff8c44dc9282a8`
- ✅ Hotel API: `68fd19f9017cce84938927c8`

### External APIs Working
- ✅ Flight Search (One-way, Round-trip, Multi-city)
- ✅ Flight Tracking
- ✅ Flight Schedules
- ✅ IATA Code Search
- ✅ Hotel Search (By city, By name)
- ✅ Hotel Details
- ✅ Booking Information

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Easy & Free)

**Why Railway?**
- Free tier available
- Automatic deployments
- Built-in PostgreSQL/MongoDB
- Simple CLI

**Steps:**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add environment variables
railway variables set FLIGHT_API_KEY=68fd119661ff8c44dc9282a8
railway variables set HOTEL_API_KEY=68fd19f9017cce84938927c8
railway variables set JWT_SECRET=qwenfly_super_secret_jwt_key_2024
railway variables set MONGODB_URI=your_mongodb_connection_string

# 5. Deploy
railway up
```

**Configuration File:** `railway.json` ✅ Already configured

---

### Option 2: Render (Free Tier Available)

**Why Render?**
- Free tier with MongoDB
- GitHub integration
- Auto-deploy on push
- Simple UI

**Steps:**
1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Configure:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
6. Add environment variables (see below)
7. Click "Create Web Service"

**Configuration File:** `render.yaml` ✅ Already configured

---

### Option 3: Heroku (Reliable but Paid)

**Why Heroku?**
- Very reliable
- Great documentation
- Many add-ons
- Industry standard

**Steps:**
```bash
# 1. Login
heroku login

# 2. Create app
heroku create qwenfly-api

# 3. Add MongoDB addon
heroku addons:create mongolab:sandbox

# 4. Set environment variables
heroku config:set FLIGHT_API_KEY=68fd119661ff8c44dc9282a8
heroku config:set HOTEL_API_KEY=68fd19f9017cce84938927c8
heroku config:set JWT_SECRET=qwenfly_super_secret_jwt_key_2024

# 5. Deploy
git push heroku main
```

---

### Option 4: Vercel (Serverless)

**Why Vercel?**
- Excellent for serverless
- Free tier generous
- Great DX
- Fast deployments

**Steps:**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Add environment variables
vercel env add FLIGHT_API_KEY
vercel env add HOTEL_API_KEY
vercel env add MONGODB_URI
vercel env add JWT_SECRET

# 4. Deploy to production
vercel --prod
```

**Configuration File:** `vercel.json` ✅ Already configured

---

## 🔑 Environment Variables for Deployment

**Required Variables:**
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.com

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=qwenfly_super_secret_jwt_key_2024
JWT_EXPIRE=7d

# External APIs (Already have these!)
FLIGHT_API_KEY=68fd119661ff8c44dc9282a8
FLIGHT_API_BASE_URL=https://api.flightapi.io
HOTEL_API_KEY=68fd19f9017cce84938927c8
HOTEL_API_BASE_URL=https://api.makcorps.com
```

**Optional Variables:**
```env
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (for images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📊 Post-Deployment Verification

### Test Your Deployed API

```bash
# Replace YOUR_DEPLOYED_URL with actual URL

# 1. Health check
curl https://YOUR_DEPLOYED_URL/api/health

# 2. Test flight search
curl "https://YOUR_DEPLOYED_URL/api/flights/search?from=NYC&to=LAX&departureDate=2025-12-25&passengers=1&class=Economy&currency=USD"

# 3. Test hotel search
curl "https://YOUR_DEPLOYED_URL/api/hotels/search?cityId=126693&checkIn=2025-12-25&checkOut=2025-12-26&rooms=1&guests=2&currency=USD"
```

### Expected Responses

**Health Check:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "service": "Travel Booking API"
}
```

**Flight Search:**
```json
{
  "success": true,
  "data": {
    "flights": [...],
    "searchParams": {...},
    "metadata": {...}
  }
}
```

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
- Solution: Use MongoDB Atlas (free tier)
- Get connection string from: https://cloud.mongodb.com
- Format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

**2. API Keys Not Working**
- Solution: Double-check environment variables
- Verify keys are set in deployment platform
- Keys are case-sensitive

**3. CORS Errors**
- Solution: Update `CLIENT_URL` environment variable
- Must match your frontend URL exactly

**4. Build Failed**
- Solution: Ensure `package.json` is in server directory
- Check Node.js version (need 16+)

## 📱 Frontend Deployment

### Update Frontend API URL

**In client/.env:**
```env
REACT_APP_API_URL=https://YOUR_DEPLOYED_BACKEND_URL/api
```

### Deploy Frontend

**Vercel (Recommended for React):**
```bash
cd client
vercel --prod
```

**Netlify:**
```bash
cd client
npm run build
netlify deploy --prod --dir=build
```

## 🎯 Final Checklist

Before going live:

- [ ] Backend deployed successfully
- [ ] All environment variables set
- [ ] Health check endpoint returns 200
- [ ] Flight search returns data
- [ ] Hotel search returns data
- [ ] MongoDB connected
- [ ] Frontend deployed
- [ ] Frontend connected to backend
- [ ] CORS configured correctly
- [ ] Error monitoring setup (optional)
- [ ] Analytics setup (optional)

## 📈 Monitoring & Maintenance

### Recommended Tools

1. **Uptime Monitoring:**
   - UptimeRobot (free)
   - Better Uptime
   - Pingdom

2. **Error Tracking:**
   - Sentry (free tier)
   - LogRocket
   - Bugsnag

3. **Analytics:**
   - Google Analytics
   - Mixpanel
   - Plausible

### API Usage Monitoring

Monitor your external API usage:
- Flight API: Check dashboard at api.flightapi.io
- Hotel API: Check dashboard at api.makcorps.com

## 💰 Cost Estimation

### Free Tier Deployment (Recommended for MVP)

| Service | Provider | Cost |
|---------|----------|------|
| Backend Hosting | Railway/Render | $0 |
| Frontend Hosting | Vercel/Netlify | $0 |
| Database | MongoDB Atlas | $0 |
| **Total** | | **$0/month** |

### Production Scale

| Service | Provider | Estimated Cost |
|---------|----------|----------------|
| Backend Hosting | Railway Pro | $5-20/month |
| Frontend Hosting | Vercel Pro | $20/month |
| Database | MongoDB Atlas | $9-57/month |
| **Total** | | **$34-97/month** |

## 🚀 Ready to Deploy!

Everything is configured and ready to deploy. Choose your platform and follow the steps above!

**Quick Start:**
```bash
# Railway (Easiest)
npm install -g @railway/cli
railway login
railway init
railway up

# Your app will be live in minutes! 🎉
```

## 📞 Support Resources

- **Documentation:** See `API_INTEGRATION_GUIDE.md`
- **Quick Start:** See `QUICK_START.md`
- **Flight API Docs:** https://api.flightapi.io
- **Hotel API Docs:** https://api.makcorps.com

---

**🎊 You're all set for deployment!**

Choose your platform, set environment variables, and deploy!
