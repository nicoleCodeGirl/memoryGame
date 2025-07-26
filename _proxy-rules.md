# Proxy Configuration for Main Website

## Overview
This document explains how to configure your main website (myWebsite repository) to proxy `/memory-game` requests to your deployed memory game.

## Step 1: Cloudflare Workers (Recommended)

### Option A: Cloudflare Workers
1. Go to Cloudflare Dashboard → Workers & Pages
2. Create a new Worker
3. Use this code:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Check if the request is for /memory-game
  if (url.pathname.startsWith('/memory-game')) {
    // Proxy to your memory game deployment
    const memoryGameUrl = 'https://your-memory-game-url.pages.dev'
    
    // Create new URL for the memory game
    const newUrl = new URL(url.pathname.replace('/memory-game', ''), memoryGameUrl)
    newUrl.search = url.search
    
    // Create new request
    const newRequest = new Request(newUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
    
    // Fetch from memory game
    const response = await fetch(newRequest)
    
    // Return response with updated headers
    const newResponse = new Response(response.body, response)
    newResponse.headers.set('Access-Control-Allow-Origin', '*')
    
    return newResponse
  }
  
  // For all other requests, pass through to your main website
  return fetch(request)
}
```

4. Deploy the Worker
5. Add a route: `nicolecodegirl.com/memory-game/*` → Your Worker

## Step 2: Alternative - Nginx Configuration

If your main website uses a traditional server, add this to your nginx config:

```nginx
server {
    listen 80;
    server_name nicolecodegirl.com www.nicolecodegirl.com;
    
    # Your existing main website configuration
    location / {
        # Your main website files
    }
    
    # Proxy memory game requests
    location /memory-game {
        proxy_pass https://your-memory-game-url.pages.dev;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle subdirectory properly
        rewrite ^/memory-game/(.*)$ /$1 break;
    }
}
```

## Step 3: Update Memory Game for Subdirectory

Your memory game needs to be aware it's running in a subdirectory. Update these files:

### Update server.js
Add base path handling:

```javascript
// Add this near the top of server.js
const BASE_PATH = process.env.BASE_PATH || '';

// Update your routes to include the base path
app.use(BASE_PATH + '/', express.static(path.join(__dirname, 'public')));
app.get(BASE_PATH + '/', function(req, res) { /* ... */ });
app.get(BASE_PATH + '/memoryGame', function(req, res) { /* ... */ });
```

### Update EJS templates
Update all internal links to be relative or include the base path:

```html
<!-- Instead of -->
<a href="/memoryGame">Play Game</a>

<!-- Use -->
<a href="memoryGame">Play Game</a>
<!-- or -->
<a href="<%= BASE_PATH %>/memoryGame">Play Game</a>
```

## Step 4: Environment Variables

Add to your Cloudflare Pages environment variables:
```
BASE_PATH=/memory-game
```

## Step 5: Test the Integration

1. Deploy your memory game to Cloudflare Pages
2. Configure the proxy on your main website
3. Test: `www.nicolecodegirl.com/memory-game`
4. Verify all links work correctly
5. Test the game functionality

## Troubleshooting

### Common Issues:
1. **404 Errors**: Check that the proxy path is correct
2. **CORS Issues**: Ensure proper headers are set
3. **Broken Links**: Verify all internal links are relative
4. **Static Files**: Make sure CSS/JS files load correctly

### Testing Commands:
```bash
# Test the proxy
curl -I https://www.nicolecodegirl.com/memory-game

# Test the memory game directly
curl -I https://your-memory-game-url.pages.dev
```

## Benefits of This Approach

✅ **Separate Repositories**: Keep both projects independent
✅ **Easy Updates**: Update memory game without touching main website
✅ **Clean URLs**: Users see `nicolecodegirl.com/memory-game`
✅ **Scalable**: Easy to add more subdirectories later
✅ **Performance**: Cloudflare handles the proxy efficiently 