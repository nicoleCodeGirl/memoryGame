# Railway Database Setup Guide

## The Problem
Your Railway deployment doesn't have a database connected, which is why when someone tries to post a score, they see a JSON error instead of the leaderboard.

## The Solution
You need to add a MySQL database to your Railway project and connect it to your app.

## Step-by-Step Instructions

### 1. Add MySQL Database to Railway
1. Go to your Railway dashboard: https://railway.app/dashboard
2. Click on your memory game project
3. Click "New" → "Database" → "MySQL"
4. Wait for the database to be created

### 2. Railway Automatically Sets Up Connection
✅ **Good news!** Railway automatically creates the `MYSQL_URL` environment variable when you add a MySQL database. You don't need to manually set anything up.

### 3. Deploy the Changes
1. Railway will automatically redeploy your app when the database is added
2. Wait for the deployment to complete
3. Test your game by playing and trying to post a score

## What This Does
- Railway automatically provides `MYSQL_URL` with the correct database connection
- Your app will now be able to save scores to the leaderboard
- The JSON error will be replaced with a proper redirect to the leaderboard

## Testing
After setup, try:
1. Playing a game
2. Completing it
3. Clicking "Yes" to post your score
4. You should be redirected to the leaderboard instead of seeing JSON error

## Note
You don't need to keep your laptop running! Railway handles everything in the cloud.

## Current Status
Based on your environment variables, you already have:
- ✅ MySQL database service
- ✅ MYSQL_URL environment variable
- ✅ All necessary MySQL connection variables

The app should now work correctly with the database connection! 