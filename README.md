# Clash Royale Deck Suggester - PWA

A Progressive Web App for suggesting the best Clash Royale decks based on your card collection.

## Features

- PWA support - Install as an app on your device
- Offline support via Service Worker
- Dark theme inspired by Clash Royale
- AI-powered deck recommendations
- Meta deck suggestions
- Card collection filtering and sorting

## Deployment to Vercel

### ⚠️ IMPORTANT: IP Whitelisting Required

**Vercel serverless functions use dynamic IPs**, but the Clash Royale developer portal **requires at least one IP address** to be whitelisted.

### Solution: Use a Proxy Server with Static IP

Since you must whitelist at least one IP, deploy a proxy server on a service with a **static IP**, then configure Vercel to use that proxy.

**See `PROXY_SETUP_GUIDE.md` for complete step-by-step instructions.**

### Quick Setup - Render.com (FREE, 2 Minutes!)

**See `FREE_PROXY_SETUP.md` for complete step-by-step instructions.**

1. **Deploy Proxy on Render.com** (FREE):
   - Go to [render.com](https://render.com) and sign up (free, no credit card)
   - Click "New +" → "Web Service"
   - Upload files from `render-proxy/` folder: `server.js` and `package.json`
   - Set environment variable: `API_TOKEN` = your Clash Royale token
   - Render auto-provides static IP (check service logs or network settings)

2. **Whitelist IP in Clash Royale Portal**:
   - Get your Render static IP (from service logs or `nslookup your-service.onrender.com`)
   - Go to [developer.clashroyale.com](https://developer.clashroyale.com/)
   - Edit your API token
   - Add the Render static IP to whitelist
   - Save changes

3. **Configure Vercel**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `PROXY_URL` = `https://your-service.onrender.com`
   - Redeploy

**That's it! Render.com is 100% free and perfect for this use case.**

### Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A proxy server with static IP (Railway, Render, or Fly.io - all have free tiers)
3. Your Clash Royale API token

### Steps

1. **Deploy Proxy Server** (see `PROXY_SETUP_GUIDE.md`):
   - Choose a service: Railway (easiest), Render, or Fly.io
   - Deploy `proxy-server.js`
   - Get the static IP address

2. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```

3. **Set Environment Variable**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add `API_TOKEN` with your Clash Royale API token value
   - Select all environments (Production, Preview, Development)
   - **Never commit tokens to Git**

4. **Create App Icons**:
   - Create `icon-192.png` (192x192 pixels)
   - Create `icon-512.png` (512x512 pixels)
   - Place them in the `public/` directory
   - See `ICONS_README.md` for design guidelines
   - Or use `generate-icons.html` in your browser

5. **Deploy**:
   ```bash
   vercel
   ```
   
   Or connect your GitHub repository to Vercel for automatic deployments.

6. **Verify Deployment**:
   - Test: `https://your-app.vercel.app/api/player?tag=YOURTAG`
   - If you get `403` or `accessDenied.invalidIp`, ensure IP restrictions are removed

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set API Token** (in `server.js` or `api/player.js`):
   - Update the `API_TOKEN` constant with your token

3. **Start server**:
   ```bash
   npm start
   ```

4. **Open browser**:
   - Navigate to `http://localhost:3000`

## PWA Features

- **Installable**: Users can install the app on their device
- **Offline Support**: Basic functionality works offline
- **Fast Loading**: Service Worker caches assets
- **App-like Experience**: Standalone display mode

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # Styles
├── script.js           # Application logic
├── sw.js              # Service Worker
├── manifest.json      # PWA manifest
├── vercel.json        # Vercel configuration
├── api/
│   └── player.js      # Vercel serverless function
├── server.js          # Local development server
└── package.json       # Dependencies
```

## Environment Variables

For production, set in Vercel:
- `API_TOKEN`: Your Clash Royale API token

## Browser Support

- Chrome (recommended)
- Firefox
- Edge
- Safari (iOS 11.3+)
- Mobile browsers with PWA support

## Notes

- The app uses Vercel serverless functions for API proxying
- Service Worker caches static assets for offline use
- API requests always go through the serverless function (no CORS issues)
- Icons are required for PWA installation - see `ICONS_README.md`
