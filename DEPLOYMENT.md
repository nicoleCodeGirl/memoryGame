# Memory Game Deployment Guide

## Overview
This guide will help you deploy your memory game to Cloudflare Pages with AWS RDS for the database.

## Prerequisites
- ✅ Cloudflare account
- ✅ AWS account
- ✅ GitHub repository for memory game
- ✅ Existing website at www.nicolecodegirl.com

## Step 1: Set up AWS RDS Database

### 1.1 Create RDS Instance
1. Go to AWS Console → RDS
2. Click "Create database"
3. Choose "Standard create"
4. Select "MySQL"
5. Choose "Free tier" (if available) or "Production"
6. Configure:
   - **DB instance identifier**: `memory-game-db`
   - **Master username**: `admin`
   - **Master password**: [create a strong password]
   - **DB instance class**: `db.t3.micro` (free tier)
   - **Storage**: 20 GB
   - **Multi-AZ deployment**: No (for cost savings)

### 1.2 Configure Security Group
1. Create a new security group
2. Add inbound rule:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: 0.0.0.0/0 (or your Cloudflare IPs)

### 1.3 Get Connection Details
- **Endpoint**: `your-db-name.region.rds.amazonaws.com`
- **Port**: 3306
- **Database name**: `memoryGameDB`

## Step 2: Update Environment Variables

### 2.1 Create .env file for production
```env
DB_HOST=your-db-name.region.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=memoryGameDB
DB_PORT=3306
NODE_ENV=production
PORT=3000
```

### 2.2 Update server.js for Cloudflare
The server needs to be configured for Cloudflare Pages. Update your server.js:

```javascript
// Add this at the top of server.js
const PORT = process.env.PORT || 3000;

// Update your app.listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 3: Deploy to Cloudflare Pages

### 3.1 Connect GitHub Repository
1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project"
3. Choose "Connect to Git"
4. Select your memory game repository
5. Configure build settings:
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `public`
   - **Root directory**: `/` (leave empty)

### 3.2 Set Environment Variables in Cloudflare
In your Cloudflare Pages project settings:
1. Go to Settings → Environment variables
2. Add all variables from your .env file:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_PORT`
   - `NODE_ENV`

### 3.3 Configure Custom Domain
1. Go to Custom domains
2. Add: `memory-game.nicolecodegirl.com`
3. Update DNS records in your main domain

## Step 4: Update Your Main Website

### 4.1 Add Link to Memory Game
In your main website, add a link to the memory game:
```html
<a href="https://memory-game.nicolecodegirl.com">Play Memory Game</a>
```

### 4.2 Alternative: Subdirectory Setup
If you want it at `www.nicolecodegirl.com/memory-game`:

1. **Option A: Proxy Setup**
   - Configure your main website to proxy `/memory-game/*` to your Cloudflare Pages app
   - Add to your main website's server config:
   ```nginx
   location /memory-game {
       proxy_pass https://memory-game.nicolecodegirl.com;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
   }
   ```

2. **Option B: Build Integration**
   - Copy the built memory game files to your main website's `/memory-game` directory
   - Update all internal links to be relative

## Step 5: Test and Verify

### 5.1 Test Database Connection
1. Deploy and check if database connects
2. Test game functionality
3. Verify leaderboard works

### 5.2 Test Sound Effects
1. Ensure all sound files are accessible
2. Test on different browsers
3. Check mobile compatibility

## Troubleshooting

### Common Issues:
1. **Database Connection Failed**
   - Check security group settings
   - Verify environment variables
   - Test connection from local machine

2. **CORS Issues**
   - Add CORS headers to your server
   - Configure Cloudflare CORS settings

3. **Static Files Not Loading**
   - Check file paths in production
   - Verify build output directory

### Useful Commands:
```bash
# Test database connection locally
mysql -h your-db-endpoint -u admin -p

# Check Cloudflare Pages logs
# Go to Pages → Your Project → Functions → Logs
```

## Cost Estimation

### AWS RDS (Monthly):
- **Free Tier**: $0 (first 12 months)
- **After Free Tier**: ~$15-25/month (db.t3.micro)

### Cloudflare Pages:
- **Free Tier**: $0 (up to 100,000 requests/month)
- **Pro Plan**: $20/month (if needed)

## Security Considerations

1. **Database Security**:
   - Use strong passwords
   - Restrict IP access
   - Enable SSL connections

2. **Environment Variables**:
   - Never commit .env files
   - Use Cloudflare's secure environment variables

3. **HTTPS**:
   - Cloudflare provides free SSL certificates
   - Ensure all connections use HTTPS

## Next Steps

1. ✅ Set up AWS RDS database
2. ✅ Deploy to Cloudflare Pages
3. ✅ Configure custom domain
4. ✅ Test all functionality
5. ✅ Add link to main website
6. ✅ Monitor performance and costs

## Support

If you encounter issues:
1. Check Cloudflare Pages logs
2. Verify AWS RDS connectivity
3. Test locally with production environment variables
4. Check browser console for errors 