#!/bin/bash

echo "🚀 Travel Booking Platform - GitHub Push Script"
echo "================================================"
echo

echo "📋 Step 1: Create GitHub Repository"
echo
echo "1. Go to https://github.com"
echo "2. Click the '+' icon in the top right"
echo "3. Click 'New repository'"
echo "4. Name it: travel-booking-platform"
echo "5. Make it Public"
echo "6. Don't initialize with README"
echo "7. Click 'Create repository'"
echo
echo "Press Enter when you've created the repository..."
read

echo
echo "📋 Step 2: Get Your Repository URL"
echo
echo "Copy your repository URL from GitHub (it looks like:)"
echo "https://github.com/your-username/travel-booking-platform.git"
echo
read -p "Enter your GitHub repository URL: " REPO_URL

echo
echo "📋 Step 3: Push to GitHub"
echo

git remote add origin $REPO_URL
git branch -M main
git push -u origin main

echo
echo "🎉 Success! Your project is now on GitHub!"
echo
echo "Your repository URL: $REPO_URL"
echo
echo "Next steps:"
echo "1. Follow the deployment guides to deploy your app"
echo "2. Share your live website with friends!"
echo
