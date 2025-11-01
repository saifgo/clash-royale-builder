const https = require('https');

// Proxy URL - Set this in Vercel environment variables
// Deploy render-proxy/server.js on Render.com (FREE) - see render-proxy/README.md
// Then set PROXY_URL to your Render service URL (e.g., https://your-service.onrender.com)
const PROXY_URL = process.env.PROXY_URL;

const API_BASE_URL = 'https://api.clashroyale.com/v1';

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Extract player tag from query parameter
  const playerTag = req.query.tag;
  
  if (!playerTag) {
    res.status(400).json({ error: 'Player tag is required. Use ?tag=YOURTAG' });
    return;
  }

  const tag = playerTag.replace(/^#/, '').replace(/-/g, '');
  
  // Use proxy if configured, otherwise show error (direct API won't work with IP restrictions)
  if (!PROXY_URL) {
    res.status(500).json({ 
      error: 'Proxy server not configured. Please deploy render-proxy/server.js on Render.com (FREE) and set PROXY_URL in Vercel environment variables. See render-proxy/README.md for instructions.' 
    });
    return;
  }

  const targetUrl = `${PROXY_URL}/api/player/${tag}`;

  const options = {
    headers: {
      'Accept': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    https.get(targetUrl, options, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.status(apiRes.statusCode).send(data);
        resolve();
      });
    }).on('error', (error) => {
      console.error('Proxy error:', error);
      res.status(500).json({ error: error.message });
      resolve();
    });
  });
};
