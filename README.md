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

### Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your Clash Royale API token

### Steps

1. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```

2. **Set Environment Variable**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add `API_TOKEN` with your Clash Royale API token value
   - Or update `api/player.js` directly with your token (less secure)

3. **Create App Icons**:
   - Create `icon-192.png` (192x192 pixels)
   - Create `icon-512.png` (512x512 pixels)
   - Place them in the root directory
   - See `ICONS_README.md` for design guidelines

4. **Deploy**:
   ```bash
   vercel
   ```
   
   Or connect your GitHub repository to Vercel for automatic deployments.

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
