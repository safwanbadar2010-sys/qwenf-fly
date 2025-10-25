# 🚀 Free Tier Deployment Guide

This guide covers multiple free deployment options for the Travel Booking Platform.

## 🎯 Recommended Free Deployment Strategy

### Option 1: Vercel + Heroku (Recommended)
- **Frontend**: Vercel (Free)
- **Backend**: Heroku (Free tier available)
- **Database**: MongoDB Atlas (Free tier)

### Option 2: Netlify + Railway
- **Frontend**: Netlify (Free)
- **Backend**: Railway (Free tier)
- **Database**: Railway PostgreSQL (Free tier)

### Option 3: Render (All-in-One)
- **Frontend + Backend**: Render (Free tier)
- **Database**: Render PostgreSQL (Free tier)

---

## 🚀 Option 1: Vercel + Heroku Deployment

### Step 1: Deploy Backend to Heroku

1. **Create Heroku Account**
   - Go to [heroku.com](https://heroku.com)
   - Sign up for free account

2. **Install Heroku CLI**
   ```bash
   # Windows
   npm install -g heroku

   # macOS
   brew install heroku

   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

3. **Login to Heroku**
   ```bash
   heroku login
   ```

4. **Create Heroku App**
   ```bash
   cd server
   heroku create travel-booking-api
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_jwt_secret_key_here
   heroku config:set JWT_EXPIRE=7d
   heroku config:set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   heroku config:set STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   heroku config:set EMAIL_HOST=smtp.gmail.com
   heroku config:set EMAIL_PORT=587
   heroku config:set EMAIL_USER=your_email@gmail.com
   heroku config:set EMAIL_PASS=your_app_password
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_api_secret
   heroku config:set CLIENT_URL=https://travel-booking-frontend.vercel.app
   ```

6. **Add MongoDB Atlas**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Create free cluster
   - Get connection string
   - Set in Heroku:
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-booking
   ```

7. **Deploy to Heroku**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy Frontend**
   ```bash
   cd client
   vercel
   ```

4. **Set Environment Variables**
   - In Vercel dashboard, go to Project Settings
   - Add Environment Variable:
   - `REACT_APP_API_URL` = `https://travel-booking-api.herokuapp.com/api`

---

## 🚀 Option 2: Netlify + Railway Deployment

### Step 1: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Connect GitHub Repository**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend**
   - Select the `server` folder as root directory
   - Set environment variables in Railway dashboard:
   ```
   NODE_ENV=production
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
   CLIENT_URL=https://travel-booking-frontend.netlify.app
   ```

4. **Add Database**
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Copy connection string to `MONGODB_URI` (or use MongoDB Atlas)

### Step 2: Deploy Frontend to Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New site from Git"
   - Connect GitHub repository
   - Set build settings:
     - Build command: `cd client && npm run build`
     - Publish directory: `client/build`
   - Add environment variable:
     - `REACT_APP_API_URL` = `https://your-railway-app.railway.app/api`

---

## 🚀 Option 3: Render (All-in-One)

### Deploy Everything to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Set:
     - Root Directory: `server`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add environment variables (same as above)

3. **Deploy Frontend**
   - Click "New" → "Static Site"
   - Connect GitHub repository
   - Set:
     - Root Directory: `client`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `build`
   - Add environment variable:
     - `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`

4. **Add Database**
   - Click "New" → "PostgreSQL"
   - Copy connection string to backend environment variables

---

## 🗄️ Database Setup (MongoDB Atlas - Free)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Choose "M0 Sandbox" (Free tier)
   - Select region closest to your users
   - Create cluster

3. **Configure Database Access**
   - Go to "Database Access"
   - Add new database user
   - Set username and password

4. **Configure Network Access**
   - Go to "Network Access"
   - Add IP address (0.0.0.0/0 for all IPs)

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

---

## 🔧 Environment Variables Setup

### Backend Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-booking
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
CLIENT_URL=https://your-frontend-url.com
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## 🚀 Quick Deploy Commands

### Heroku + Vercel (Recommended)
```bash
# Backend to Heroku
cd server
heroku create travel-booking-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main

# Frontend to Vercel
cd client
vercel
```

### Railway + Netlify
```bash
# Connect to Railway via dashboard
# Connect to Netlify via dashboard
```

### Render (All-in-One)
```bash
# Connect to Render via dashboard
# Deploy both services
```

---

## 📊 Free Tier Limits

### Heroku
- **Dyno Hours**: 550 hours/month (free tier)
- **Sleep**: Apps sleep after 30 minutes of inactivity
- **Database**: Use MongoDB Atlas (free tier)

### Vercel
- **Bandwidth**: 100GB/month
- **Builds**: 100 builds/month
- **Functions**: 100GB-hours/month

### Netlify
- **Bandwidth**: 100GB/month
- **Builds**: 300 build minutes/month
- **Forms**: 100 submissions/month

### Railway
- **Usage**: $5 credit/month (free tier)
- **Sleep**: Apps sleep after inactivity
- **Database**: PostgreSQL included

### Render
- **Services**: 3 services (free tier)
- **Sleep**: Apps sleep after inactivity
- **Database**: PostgreSQL included

---

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` is set correctly in backend
   - Check CORS configuration in server/index.js

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has proper permissions

3. **Environment Variables**
   - Double-check all environment variables are set
   - Ensure no typos in variable names
   - Restart services after changing variables

4. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Check build logs for specific errors

### Performance Optimization

1. **Enable Gzip Compression**
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Optimize database queries**
5. **Use connection pooling**

---

## 🎉 Success!

Once deployed, your travel booking platform will be available at:
- **Frontend**: Your chosen frontend URL
- **Backend API**: Your chosen backend URL
- **Database**: MongoDB Atlas or chosen database

The platform includes:
- ✅ Flight booking
- ✅ Hotel booking  
- ✅ Cab booking
- ✅ Travel packages
- ✅ Payment processing
- ✅ User authentication
- ✅ Booking management
- ✅ Responsive design

All running on free tiers! 🚀
