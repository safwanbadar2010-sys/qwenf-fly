# 🚀 Deploy QwenFly NOW - Step-by-Step Guide

## ✅ Pre-Deployment Checklist

Your project is **100% ready** for deployment! Here's what's configured:

- ✅ Backend API with external Flight & Hotel APIs
- ✅ API Keys configured: Flight (`68fd119661ff8c44dc9282a8`) & Hotel (`68fd19f9017cce84938927c8`)
- ✅ All environment variables set
- ✅ Deployment configs ready (Railway, Render, Vercel, Heroku)
- ✅ Server tested and working locally
- ✅ Documentation complete

---

## 🎯 Choose Your Deployment Platform

### Option 1: Railway (⭐ RECOMMENDED - Easiest & Free)

**Why Railway?**
- ✅ Free tier with 500 hours/month
- ✅ One-command deployment
- ✅ Automatic HTTPS
- ✅ Built-in PostgreSQL/MongoDB
- ✅ Simple CLI

**Deploy Steps:**

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway (will open browser)
railway login

# 3. Navigate to project
cd c:\Users\RR\OneDrive\Desktop\QwenFly

# 4. Initialize Railway project
railway init

# 5. Add MongoDB database (optional - or use MongoDB Atlas)
railway add

# 6. Set environment variables
railway variables set JWT_SECRET=qwenfly_super_secret_jwt_key_2024
railway variables set MONGODB_URI=your_mongodb_atlas_uri

# 7. Deploy!
railway up

# 8. Get your URL
railway domain
```

**Your backend will be live in ~3 minutes!** 🎉

---

### Option 2: Render (Free Tier + Auto-Deploy)

**Why Render?**
- ✅ Free tier available
- ✅ Auto-deploy from GitHub
- ✅ Free PostgreSQL/MongoDB
- ✅ Simple web UI
- ✅ `render.yaml` already configured

**Deploy Steps:**

1. **Push to GitHub:**
```bash
cd c:\Users\RR\OneDrive\Desktop\QwenFly

# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment with Flight & Hotel APIs"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/qwenfly.git
git branch -M main
git push -u origin main
```

2. **Deploy on Render:**
   - Go to https://render.com
   - Sign in with GitHub
   - Click "New +" → "Web Service"
   - Select your `qwenfly` repository
   - Render will automatically detect `render.yaml`
   - Click "Apply"
   - **Done!** Deployment starts automatically

3. **Update Environment Variables:**
   - Go to your service dashboard
   - Click "Environment"
   - Update `MONGODB_URI` with your MongoDB Atlas connection string
   - Update `JWT_SECRET` if needed
   - Click "Save Changes"

**Your app will be live at:** `https://travel-booking-api.onrender.com`

---

### Option 3: Vercel (Serverless)

**Why Vercel?**
- ✅ Excellent for Next.js/React
- ✅ Free tier generous
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Great DX

**Deploy Steps:**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to project
cd c:\Users\RR\OneDrive\Desktop\QwenFly

# 3. Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? qwenfly
# - Directory? ./
# - Override settings? No

# 4. Add environment variables
vercel env add FLIGHT_API_KEY
# Enter: 68fd119661ff8c44dc9282a8

vercel env add HOTEL_API_KEY
# Enter: 68fd19f9017cce84938927c8

vercel env add MONGODB_URI
# Enter your MongoDB Atlas URI

vercel env add JWT_SECRET
# Enter: qwenfly_super_secret_jwt_key_2024

# 5. Deploy to production
vercel --prod
```

**Your API will be live at:** `https://qwenfly.vercel.app`

---

### Option 4: Heroku (Traditional Platform)

**Why Heroku?**
- ✅ Very reliable
- ✅ Great documentation
- ✅ Many add-ons
- ✅ Industry standard

**Deploy Steps:**

```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Navigate to project
cd c:\Users\RR\OneDrive\Desktop\QwenFly

# 4. Create Heroku app
heroku create qwenfly-api

# 5. Add MongoDB addon
heroku addons:create mongolab:sandbox

# 6. Set environment variables
heroku config:set FLIGHT_API_KEY=68fd119661ff8c44dc9282a8
heroku config:set HOTEL_API_KEY=68fd19f9017cce84938927c8
heroku config:set JWT_SECRET=qwenfly_super_secret_jwt_key_2024
heroku config:set NODE_ENV=production

# 7. Deploy
git push heroku main

# 8. Open your app
heroku open
```

**Your API will be live at:** `https://qwenfly-api.herokuapp.com`

---

## 🗄️ Database Setup (MongoDB Atlas)

**If you don't have MongoDB yet:**

1. **Go to MongoDB Atlas:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster:**
   - Choose FREE tier (M0)
   - Select region closest to your deployment
   - Click "Create Cluster"

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `qwenfly`
   - Password: Generate secure password
   - Click "Add User"

4. **Whitelist IP:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://qwenfly:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/travel-booking?retryWrites=true&w=majority`

6. **Update Environment Variables:**
   - Add this connection string as `MONGODB_URI` in your deployment platform

---

## 🎨 Frontend Deployment

### Deploy Frontend to Vercel:

```bash
# 1. Navigate to client directory
cd client

# 2. Update API URL in .env
echo REACT_APP_API_URL=https://YOUR_BACKEND_URL/api > .env

# 3. Deploy to Vercel
vercel

# 4. Production deployment
vercel --prod
```

### Deploy Frontend to Netlify:

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Navigate to client
cd client

# 3. Build the frontend
npm run build

# 4. Deploy
netlify deploy --prod --dir=build
```

---

## 🧪 Verify Deployment

After deployment, test your API:

```bash
# Replace YOUR_DEPLOYED_URL with actual URL

# 1. Health Check
curl https://YOUR_DEPLOYED_URL/api/health

# 2. Flight Search
curl "https://YOUR_DEPLOYED_URL/api/flights/search?from=NYC&to=LAX&departureDate=2025-12-25&passengers=1"

# 3. Hotel Search
curl "https://YOUR_DEPLOYED_URL/api/hotels/search?cityId=126693&checkIn=2025-12-25&checkOut=2025-12-26"
```

**Expected Response:**
- ✅ Status 200
- ✅ JSON data returned
- ✅ No errors

---

## 🔧 Troubleshooting

### Issue: "Module not found"
**Solution:** Make sure all dependencies are in `package.json`
```bash
cd server
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: "API keys not working"
**Solution:** Verify environment variables are set correctly
```bash
# For Railway
railway variables

# For Heroku
heroku config

# For Vercel
vercel env ls
```

### Issue: "Database connection failed"
**Solution:** 
1. Check MongoDB Atlas whitelist (allow 0.0.0.0/0)
2. Verify connection string format
3. Ensure database user has correct permissions

### Issue: "CORS errors"
**Solution:** Update `CLIENT_URL` environment variable with your frontend URL

---

## 📊 Post-Deployment Checklist

After deployment:

- [ ] Backend API is accessible
- [ ] Health endpoint returns 200
- [ ] Flight search returns data
- [ ] Hotel search returns data
- [ ] Database connection working
- [ ] Environment variables set
- [ ] Frontend deployed (optional)
- [ ] Frontend connected to backend
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled

---

## 🎉 Success Indicators

You'll know deployment succeeded when:

✅ You can access `https://YOUR_URL/api/health`  
✅ Flight search returns real data  
✅ Hotel search returns real data  
✅ No 500 errors in logs  
✅ Database queries work  

---

## 📞 Need Help?

**Check Logs:**

Railway:
```bash
railway logs
```

Heroku:
```bash
heroku logs --tail
```

Vercel:
```bash
vercel logs
```

Render:
- Go to dashboard → Your service → Logs

---

## 🚀 Quick Deploy Commands

**Railway (Fastest):**
```bash
npm install -g @railway/cli && railway login && railway init && railway up
```

**Render:**
Push to GitHub → Connect on Render.com → Deploy

**Vercel:**
```bash
npm install -g vercel && vercel && vercel --prod
```

**Heroku:**
```bash
heroku create qwenfly && git push heroku main
```

---

## 🎊 You're Ready!

Your QwenFly platform has:
- ✅ Real Flight API integration
- ✅ Real Hotel API integration
- ✅ Complete backend
- ✅ All configurations ready
- ✅ Documentation complete

**Choose a platform above and deploy in < 5 minutes!**

For detailed deployment guide, see: **DEPLOYMENT_CHECKLIST.md**

---

**Good luck with your deployment! 🚀**
