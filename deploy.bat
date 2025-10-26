@echo off
cls
echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║                                                           ║
echo  ║           🚀 QwenFly Deployment Assistant 🚀             ║
echo  ║                                                           ║
echo  ║              Ready to Deploy to Production!              ║
echo  ║                                                           ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo  Choose your deployment platform:
echo.
echo  [1] Railway      (⭐ Recommended - Easiest)
echo  [2] Heroku       (Traditional Platform)
echo  [3] Vercel       (Serverless)
echo  [4] Render       (Manual - via GitHub)
echo  [5] View Deployment Guide
echo  [6] Test Local Server First
echo  [0] Exit
echo.
set /p choice=Enter your choice (1-6): 

if "%choice%"=="1" goto railway
if "%choice%"=="2" goto heroku
if "%choice%"=="3" goto vercel
if "%choice%"=="4" goto render
if "%choice%"=="5" goto guide
if "%choice%"=="6" goto test
if "%choice%"=="0" goto end

echo Invalid choice. Please try again.
pause
goto :start

:railway
echo.
echo ========================================
echo  Deploying to Railway...
echo ========================================
call deploy-railway.bat
goto end

:heroku
echo.
echo ========================================
echo  Deploying to Heroku...
echo ========================================
call deploy-heroku.bat
goto end

:vercel
echo.
echo ========================================
echo  Deploying to Vercel...
echo ========================================
call deploy-vercel.bat
goto end

:render
echo.
echo ========================================
echo  Render Deployment Steps
echo ========================================
echo.
echo Render requires GitHub deployment:
echo.
echo 1. Push your code to GitHub:
echo    git init
echo    git add .
echo    git commit -m "Ready for deployment"
echo    git remote add origin YOUR_GITHUB_REPO_URL
echo    git push -u origin main
echo.
echo 2. Go to https://render.com
echo 3. Sign in with GitHub
echo 4. Click "New +" → "Web Service"
echo 5. Select your repository
echo 6. Render will auto-detect render.yaml
echo 7. Click "Apply"
echo.
echo Your app will deploy automatically!
echo.
echo render.yaml is already configured with all settings.
echo.
pause
goto end

:guide
echo.
echo Opening deployment guide...
start DEPLOY_NOW.md
pause
goto end

:test
echo.
echo ========================================
echo  Testing Local Server
echo ========================================
echo.
echo Starting server on http://localhost:5000
echo.
echo Test endpoints after server starts:
echo  - Health: http://localhost:5000/api/health
echo  - Flights: http://localhost:5000/api/flights/search?from=NYC^&to=LAX^&departureDate=2025-12-25^&passengers=1
echo.
cd server
start cmd /k "npm start"
timeout /t 5 /nobreak >nul
start http://localhost:5000/api/health
echo.
pause
goto end

:end
echo.
echo Thank you for using QwenFly Deployment Assistant!
echo.
pause
