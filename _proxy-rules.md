# Proxy Configuration for Main Website

## Overview
This document explains how to configure your main website (myWebsite repository) to proxy `/memory-game` requests to your deployed memory game on Railway.

## Your Memory Game URL
Your memory game is deployed at: `https://memorygame-production-e90d.up.railway.app`

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
    // Proxy to your Railway memory game deployment
    const memoryGameUrl = 'https://memorygame-production-e90d.up.railway.app'
    
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
        proxy_pass https://memorygame-production-e90d.up.railway.app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle subdirectory properly
        rewrite ^/memory-game/(.*)$ /$1 break;
    }
}
```

## Step 3: Test the Setup

After configuring the proxy:
1. Visit `https://www.nicolecodegirl.com/memory-game`
2. You should see your memory game
3. All game functionality should work normally

## Note
Your memory game is already configured to work in subdirectories with the `BASE_PATH` environment variable. 