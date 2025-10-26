@echo off
echo ========================================
echo  QwenFly - Vercel Deployment Script
echo ========================================
echo.

echo [1/6] Checking Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Vercel CLI
        pause
        exit /b 1
    )
)
echo ✓ Vercel CLI ready

echo.
echo [2/6] Logging in to Vercel...
echo (Browser will open for authentication)
vercel login
echo ✓ Logged in successfully

echo.
echo [3/6] Initial deployment...
echo.
echo Please answer the Vercel prompts:
echo - Set up and deploy? Yes
echo - Project name? qwenfly
echo - Directory? ./
echo.
vercel
if %errorlevel% neq 0 (
    echo ERROR: Initial deployment failed
    pause
    exit /b 1
)
echo ✓ Initial deployment complete

echo.
echo [4/6] Setting environment variables...
echo.
echo Adding FLIGHT_API_KEY...
echo 68fd119661ff8c44dc9282a8 | vercel env add FLIGHT_API_KEY production

echo Adding HOTEL_API_KEY...
echo 68fd19f9017cce84938927c8 | vercel env add HOTEL_API_KEY production

echo Adding JWT_SECRET...
echo qwenfly_super_secret_jwt_key_2024 | vercel env add JWT_SECRET production

echo.
echo NOTE: You need to add MONGODB_URI manually
echo Run: vercel env add MONGODB_URI production
echo Then paste your MongoDB Atlas connection string
echo.
pause

echo.
echo [5/6] Production deployment...
vercel --prod
if %errorlevel% neq 0 (
    echo ERROR: Production deployment failed
    pause
    exit /b 1
)
echo ✓ Deployed to production!

echo.
echo [6/6] Getting deployment URL...
vercel ls

echo.
echo ========================================
echo  ✓ DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your QwenFly API is now live!
echo.
echo Next steps:
echo 1. Check your Vercel dashboard for the URL
echo 2. Test: YOUR_URL/api/health
echo 3. Update frontend REACT_APP_API_URL
echo.
pause
