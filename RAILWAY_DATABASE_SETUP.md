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

### 2. Connect Database to Your App
1. In your Railway project, you should now see two services:
   - Your memory game app
   - The MySQL database
2. Click on your memory game app service
3. Go to the "Variables" tab
4. Add a new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** `${{ MySQL.MYSQL_URL }}`
   - This will automatically use Railway's MySQL connection URL

### 3. Deploy the Changes
1. Railway will automatically redeploy your app when you add the variable
2. Wait for the deployment to complete
3. Test your game by playing and trying to post a score

## What This Does
- `${{ MySQL.MYSQL_URL }}` is Railway's special syntax that automatically provides the correct database connection URL
- Your app will now be able to save scores to the leaderboard
- The JSON error will be replaced with a proper redirect to the leaderboard

## Alternative: Manual Database URL
If the automatic connection doesn't work, you can manually copy the database URL:
1. Click on your MySQL database service in Railway
2. Go to the "Connect" tab
3. Copy the "MySQL Connection URL"
4. Paste it as the value for `DATABASE_URL` in your app's variables

## Testing
After setup, try:
1. Playing a game
2. Completing it
3. Clicking "Yes" to post your score
4. You should be redirected to the leaderboard instead of seeing JSON error

## Note
You don't need to keep your laptop running! Railway handles everything in the cloud. 