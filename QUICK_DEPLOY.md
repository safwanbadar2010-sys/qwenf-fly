# 🚀 Quick Deploy Guide - Free Tier

## 🎯 One-Click Deployment Options

### Option 1: Vercel + Heroku (Recommended - 5 minutes)

#### Backend (Heroku)
```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login to Heroku
heroku login

# 3. Create app and deploy
cd server
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set STRIPE_SECRET_KEY=sk_test_your_stripe_key
heroku config:set CLIENT_URL=https://your-frontend.vercel.app
git push heroku main
```

#### Frontend (Vercel)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd client
vercel

# 3. Set environment variable in Vercel dashboard
# REACT_APP_API_URL = https://your-app-name.herokuapp.com/api
```

### Option 2: Render (All-in-One - 3 minutes)

1. **Go to [render.com](https://render.com)**
2. **Connect GitHub repository**
3. **Deploy Backend:**
   - New → Web Service
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

4. **Deploy Frontend:**
   - New → Static Site
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Add environment variable: `REACT_APP_API_URL`

### Option 3: Railway (All-in-One - 2 minutes)

1. **Go to [railway.app](https://railway.app)**
2. **Connect GitHub repository**
3. **Deploy Backend:**
   - Select `server` folder
   - Add environment variables
   - Deploy

4. **Deploy Frontend:**
   - Select `client` folder
   - Add environment variable: `REACT_APP_API_URL`
   - Deploy

## 🗄️ Database Setup (MongoDB Atlas - Free)

1. **Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)**
2. **Create free account**
3. **Create M0 cluster (free tier)**
4. **Get connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/travel-booking
   ```

## 🔧 Environment Variables

### Backend (Required)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-booking
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=https://your-frontend-url.com
```

### Frontend (Required)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## 🎉 Success!

Your travel booking platform will be live at:
- **Frontend**: Your chosen frontend URL
- **Backend**: Your chosen backend URL
- **Features**: Flights, Hotels, Cabs, Packages, Payments

All on free tiers! 🚀

## 📱 Test Your Deployment

1. **Visit your frontend URL**
2. **Try booking a flight**
3. **Test user registration**
4. **Check payment flow**

## 🔧 Troubleshooting

### Common Issues:
- **CORS errors**: Check `CLIENT_URL` in backend
- **Database connection**: Verify MongoDB Atlas URI
- **Build failures**: Check Node.js version (18+)
- **Environment variables**: Ensure all are set correctly

### Quick Fixes:
```bash
# Restart services after env changes
heroku restart

# Check logs
heroku logs --tail

# Verify environment variables
heroku config
```

## 🚀 Performance Tips

1. **Enable compression**
2. **Use CDN for static assets**
3. **Implement caching**
4. **Optimize images**
5. **Use connection pooling**

Your travel booking platform is now live and ready for users! 🎊
