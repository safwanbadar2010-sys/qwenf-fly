@echo off
echo ========================================
echo  QwenFly - Railway Deployment Script
echo ========================================
echo.

echo [1/6] Checking Railway CLI...
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo Railway CLI not found. Installing...
    npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Railway CLI
        pause
        exit /b 1
    )
)
echo ✓ Railway CLI ready

echo.
echo [2/6] Logging in to Railway...
echo (Browser will open for authentication)
railway login
if %errorlevel% neq 0 (
    echo ERROR: Railway login failed
    pause
    exit /b 1
)
echo ✓ Logged in successfully

echo.
echo [3/6] Initializing Railway project...
railway init
if %errorlevel% neq 0 (
    echo ERROR: Failed to initialize project
    pause
    exit /b 1
)
echo ✓ Project initialized

echo.
echo [4/6] Setting environment variables...
echo Setting JWT_SECRET...
railway variables set JWT_SECRET=qwenfly_super_secret_jwt_key_2024

echo.
echo NOTE: You need to set MONGODB_URI manually
echo Please run: railway variables set MONGODB_URI=your_mongodb_atlas_connection_string
echo.
pause

echo.
echo [5/6] Deploying to Railway...
railway up
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)
echo ✓ Deployed successfully!

echo.
echo [6/6] Getting your deployment URL...
railway domain

echo.
echo ========================================
echo  ✓ DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your QwenFly API is now live!
echo.
echo Next steps:
echo 1. Test your API at the URL shown above
echo 2. Add /api/health to check server status
echo 3. Update frontend REACT_APP_API_URL with your new URL
echo.
pause
