@echo off
echo ========================================
echo  Railway Quick Domain Fix
echo ========================================
echo.

echo Step 1: Navigate to project folder...
cd c:\Users\RR\OneDrive\Desktop\QwenFly

echo.
echo Step 2: Login to Railway...
echo (Browser will open - login and return here)
call railway login

echo.
echo Step 3: Link to your project...
call railway link

echo.
echo Step 4: Check current variables...
call railway variables

echo.
echo Step 5: Setting missing variables...
call railway variables set MONGODB_URI="mongodb+srv://qwenfly:Wd9AIAr623wWjCM4@qwenfly-cluster.kpz94eq.mongodb.net/travel-booking?retryWrites=true&w=majority"
call railway variables set JWT_SECRET="qwenfly_super_secret_jwt_key_2024"
call railway variables set FLIGHT_API_KEY="68fd119661ff8c44dc9282a8"
call railway variables set HOTEL_API_KEY="68fd19f9017cce84938927c8"
call railway variables set FLIGHT_API_BASE_URL="https://api.flightapi.io"
call railway variables set HOTEL_API_BASE_URL="https://api.makcorps.com"
call railway variables set NODE_ENV="production"

echo.
echo Step 6: Redeploying...
call railway up

echo.
echo Step 7: Getting your domain...
call railway domain

echo.
echo ========================================
echo  DONE! Check the domain above
echo ========================================
echo.
echo Test it: https://YOUR-DOMAIN/api/health
echo.
pause
