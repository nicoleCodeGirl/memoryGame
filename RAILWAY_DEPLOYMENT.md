# Railway Deployment Guide

## Prerequisites
- GitHub account with your memoryGame repository
- Railway account (free at railway.app)

## Step 1: Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Railway will automatically detect your repositories

## Step 2: Deploy Your Memory Game
1. **Click "New Project"** in Railway dashboard
2. **Select "Deploy from GitHub repo"**
3. **Choose your `memoryGame` repository**
4. **Railway will automatically detect it's a Node.js app**

## Step 3: Configure Environment Variables
In your Railway project dashboard:

### Add these environment variables:
```
DB_HOST=your-aws-rds-endpoint.amazonaws.com
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=memoryGameDB
DB_PORT=3306
BASE_PATH=/memory-game
```

### To get your AWS RDS details:
1. Go to AWS Console → RDS
2. Select your database instance
3. Copy the endpoint, username, and password
4. Make sure your RDS security group allows connections from anywhere (0.0.0.0/0) on port 3306

## Step 4: Deploy
1. Railway will automatically start building and deploying
2. Watch the build logs for any errors
3. Once deployed, Railway will give you a URL like: `https://your-app-name.railway.app`

## Step 5: Test Your Deployment
1. Visit your Railway URL
2. Test the game functionality
3. Check that the database connection works
4. Verify sound effects load properly

## Step 6: Set Up Custom Domain (Optional)
1. In Railway dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update your DNS settings as instructed

## Troubleshooting

### Common Issues:
- **Database connection failed**: Check your RDS security group settings
- **Build failed**: Check the build logs in Railway dashboard
- **Environment variables not working**: Make sure they're set correctly in Railway

### Check Logs:
- Go to Railway dashboard → your project → "Deployments"
- Click on the latest deployment to see logs

## Next Steps
Once deployed successfully, you can:
1. Set up the proxy on your main website
2. Test the subdirectory integration
3. Monitor performance and costs

## Cost Estimation
- **Railway**: Free tier includes $5 credit/month
- **AWS RDS**: ~$15-20/month for small instance
- **Total**: ~$15-25/month for full deployment 