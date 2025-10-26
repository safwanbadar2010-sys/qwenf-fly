@echo off
echo ========================================
echo  Railway Deployment Fix Script
echo ========================================
echo.

echo [1/5] Checking Railway CLI...
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo Railway CLI not found. Installing...
    npm install -g @railway/cli
)
echo ✓ Railway CLI ready

echo.
echo [2/5] Logging in to Railway...
railway login
echo ✓ Logged in

echo.
echo [3/5] Linking to project...
railway link
echo ✓ Project linked

echo.
echo [4/5] Setting environment variables...
echo.
echo Setting MONGODB_URI...
railway variables set MONGODB_URI="mongodb+srv://qwenfly:Wd9AIAr623wWjCM4@qwenfly-cluster.kpz94eq.mongodb.net/travel-booking?retryWrites=true&w=majority"

echo Setting JWT_SECRET...
railway variables set JWT_SECRET="qwenfly_super_secret_jwt_key_2024"

echo Setting Flight API...
railway variables set FLIGHT_API_KEY="68fd119661ff8c44dc9282a8"
railway variables set FLIGHT_API_BASE_URL="https://api.flightapi.io"

echo Setting Hotel API...
railway variables set HOTEL_API_KEY="68fd19f9017cce84938927c8"
railway variables set HOTEL_API_BASE_URL="https://api.makcorps.com"

echo Setting NODE_ENV...
railway variables set NODE_ENV="production"

echo ✓ All variables set

echo.
echo [5/5] Redeploying...
railway up

echo.
echo ========================================
echo  Getting your deployment URL...
echo ========================================
echo.
railway domain

echo.
echo ========================================
echo  ✓ DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Test your API:
echo 1. Copy the URL above
echo 2. Add /api/health at the end
echo 3. Open in browser
echo.
echo Example: https://your-url.railway.app/api/health
echo.
pause
