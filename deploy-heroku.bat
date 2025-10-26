@echo off
echo ========================================
echo  QwenFly - Heroku Deployment Script
echo ========================================
echo.

echo [1/7] Checking Heroku CLI...
where heroku >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Heroku CLI not found
    echo Please install from: https://devcenter.heroku.com/articles/heroku-cli
    echo After installation, run this script again
    pause
    exit /b 1
)
echo ✓ Heroku CLI ready

echo.
echo [2/7] Logging in to Heroku...
heroku login
if %errorlevel% neq 0 (
    echo ERROR: Heroku login failed
    pause
    exit /b 1
)
echo ✓ Logged in successfully

echo.
echo [3/7] Creating Heroku app...
set /p APP_NAME=Enter your app name (e.g., qwenfly-api): 
heroku create %APP_NAME%
if %errorlevel% neq 0 (
    echo WARNING: App might already exist or name taken
    echo Continuing with existing app...
)
echo ✓ App ready

echo.
echo [4/7] Adding MongoDB addon...
heroku addons:create mongolab:sandbox -a %APP_NAME%
if %errorlevel% neq 0 (
    echo WARNING: Failed to add MongoDB addon
    echo You may need to add MONGODB_URI manually
)

echo.
echo [5/7] Setting environment variables...
heroku config:set FLIGHT_API_KEY=68fd119661ff8c44dc9282a8 -a %APP_NAME%
heroku config:set HOTEL_API_KEY=68fd19f9017cce84938927c8 -a %APP_NAME%
heroku config:set FLIGHT_API_BASE_URL=https://api.flightapi.io -a %APP_NAME%
heroku config:set HOTEL_API_BASE_URL=https://api.makcorps.com -a %APP_NAME%
heroku config:set JWT_SECRET=qwenfly_super_secret_jwt_key_2024 -a %APP_NAME%
heroku config:set NODE_ENV=production -a %APP_NAME%
heroku config:set PORT=5000 -a %APP_NAME%
echo ✓ Environment variables set

echo.
echo [6/7] Checking Git repository...
if not exist .git (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit for Heroku deployment"
)
echo ✓ Git repository ready

echo.
echo [7/7] Deploying to Heroku...
git remote add heroku https://git.heroku.com/%APP_NAME%.git
git push heroku main
if %errorlevel% neq 0 (
    echo Trying master branch...
    git push heroku master
)

echo.
echo ========================================
echo  ✓ DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your QwenFly API is now live at:
echo https://%APP_NAME%.herokuapp.com
echo.
echo Opening your app...
heroku open -a %APP_NAME%

echo.
echo Next steps:
echo 1. Test: https://%APP_NAME%.herokuapp.com/api/health
echo 2. View logs: heroku logs --tail -a %APP_NAME%
echo 3. Update frontend with your new API URL
echo.
pause
