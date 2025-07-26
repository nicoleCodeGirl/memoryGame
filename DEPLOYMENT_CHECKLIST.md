# Memory Game Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. AWS RDS Database
- [ ] Create MySQL RDS instance
- [ ] Configure security group (allow port 3306)
- [ ] Note down connection details:
  - Endpoint: `your-db-name.region.rds.amazonaws.com`
  - Username: `admin`
  - Password: `your-password`
  - Database: `memoryGameDB`

### 2. Memory Game Repository
- [ ] All hardcoded localhost:3000 links updated to relative paths
- [ ] BASE_PATH support added to server.js
- [ ] All routes updated to include BASE_PATH
- [ ] Sound effects added to public/sounds/ folder
- [ ] Repository URL restored in package.json

## ✅ Cloudflare Pages Deployment

### 3. Deploy Memory Game
- [ ] Go to Cloudflare Dashboard → Pages
- [ ] Create new project from memoryGame repository
- [ ] Configure build settings:
  - Framework preset: None
  - Build command: `npm run build`
  - Build output directory: `public`
- [ ] Set environment variables:
  ```
  DB_HOST=your-aws-rds-endpoint
  DB_USER=admin
  DB_PASSWORD=your-password
  DB_NAME=memoryGameDB
  DB_PORT=3306
  NODE_ENV=production
  BASE_PATH=/memory-game
  ```
- [ ] Deploy and note the URL (e.g., `memory-game-123abc.pages.dev`)

## ✅ Main Website Proxy Setup

### 4. Configure Proxy (Choose One)

#### Option A: Cloudflare Workers (Recommended)
- [ ] Go to Cloudflare Dashboard → Workers & Pages
- [ ] Create new Worker
- [ ] Copy the Worker code from `_proxy-rules.md`
- [ ] Update `memoryGameUrl` in the Worker code
- [ ] Deploy the Worker
- [ ] Add route: `nicolecodegirl.com/memory-game/*` → Your Worker

#### Option B: Nginx Configuration
- [ ] Add nginx configuration from `_proxy-rules.md`
- [ ] Update `proxy_pass` URL
- [ ] Restart nginx

## ✅ Testing

### 5. Test the Integration
- [ ] Test main website: `www.nicolecodegirl.com`
- [ ] Test memory game directly: `your-memory-game-url.pages.dev`
- [ ] Test subdirectory: `www.nicolecodegirl.com/memory-game`
- [ ] Verify all links work correctly
- [ ] Test game functionality:
  - [ ] Card flipping
  - [ ] Sound effects
  - [ ] Matching logic
  - [ ] Leaderboard
  - [ ] Score submission

### 6. Test Navigation
- [ ] From main website to memory game
- [ ] From memory game to leaderboard
- [ ] From leaderboard back to game
- [ ] From memory game to main website

## ✅ Final Steps

### 7. Add Link to Main Website
- [ ] Add link to memory game on your main website
- [ ] Example: `<a href="/memory-game">Play Memory Game</a>`

### 8. Monitor and Debug
- [ ] Check Cloudflare Pages logs
- [ ] Monitor AWS RDS connections
- [ ] Test on different browsers
- [ ] Test on mobile devices

## 🔧 Troubleshooting

### Common Issues:
1. **404 Errors**: Check proxy configuration
2. **Database Connection**: Verify AWS RDS settings
3. **CORS Issues**: Check Worker headers
4. **Broken Links**: Verify relative paths
5. **Sound Not Playing**: Check file paths

### Useful Commands:
```bash
# Test proxy
curl -I https://www.nicolecodegirl.com/memory-game

# Test direct access
curl -I https://your-memory-game-url.pages.dev

# Check database connection
mysql -h your-db-endpoint -u admin -p
```

## 📞 Support

If you encounter issues:
1. Check Cloudflare Pages deployment logs
2. Verify environment variables
3. Test database connectivity
4. Check browser console for errors
5. Verify proxy configuration

## 🎯 Success Criteria

✅ Memory game accessible at `www.nicolecodegirl.com/memory-game`
✅ All game functionality works correctly
✅ Sound effects play properly
✅ Leaderboard saves and displays scores
✅ Navigation between pages works smoothly
✅ Main website remains unaffected
✅ Database connections are stable 