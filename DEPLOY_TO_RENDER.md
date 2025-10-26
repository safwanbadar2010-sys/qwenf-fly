# 🚀 Deploy to Render (100% Free Alternative)

## ✅ Why Render?
- 🆓 **Completely FREE** - No credit card required
- 🔄 **Auto-deploy from GitHub** - Push code and it deploys
- 🌐 **Free SSL** - Automatic HTTPS
- 📊 **Easy dashboard** - Visual interface

---

## 📋 **Step-by-Step Deployment**

### **Step 1: Push Code to GitHub**

```cmd
cd c:\Users\RR\OneDrive\Desktop\QwenFly

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "QwenFly - Ready for Render deployment"

# Create repository on GitHub
# Go to: https://github.com/new
# Name: qwenfly
# Click "Create repository"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/qwenfly.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### **Step 2: Deploy on Render**

1. **Go to Render:**
   - Visit: https://render.com
   - Click "Get Started for Free"
   - Sign in with GitHub

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Find and select your `qwenfly` repository
   - Click "Connect"

3. **Render Auto-Detects Configuration:**
   - Render will read your `render.yaml` file
   - Click "Apply" to use the configuration
   - ✅ All settings auto-configured!

4. **Add Environment Variables:**
   
   Render will prompt for these (or add in dashboard):
   
   ```
   MONGODB_URI = mongodb+srv://qwenfly:Wd9AIAr623wWjCM4@qwenfly-cluster.kpz94eq.mongodb.net/travel-booking?retryWrites=true&w=majority
   
   JWT_SECRET = qwenfly_super_secret_jwt_key_2024
   
   FLIGHT_API_KEY = 68fd119661ff8c44dc9282a8
   
   HOTEL_API_KEY = 68fd19f9017cce84938927c8
   
   FLIGHT_API_BASE_URL = https://api.flightapi.io
   
   HOTEL_API_BASE_URL = https://api.makcorps.com
   
   NODE_ENV = production
   ```

5. **Click "Create Web Service"**
   - Wait 5-7 minutes for deployment
   - Render builds and deploys automatically!

6. **Get Your URL:**
   - Render gives you: `https://qwenfly.onrender.com`
   - Test: `https://qwenfly.onrender.com/api/health`

---

## 🧪 **Test After Deployment**

```
https://qwenfly.onrender.com/api/health
https://qwenfly.onrender.com/api/flights/search?from=NYC&to=LAX&departureDate=2025-12-25&passengers=1
```

---

## ✅ **Success!**

Your QwenFly platform will be live at:
- Backend: `https://qwenfly.onrender.com`
- All 45+ endpoints working
- MongoDB connected
- Flight & Hotel APIs integrated

**100% FREE forever!** 🎉
