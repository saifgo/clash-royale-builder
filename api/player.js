const https = require('https');
const { URL } = require('url');

// Proxy URL - Set this in Vercel environment variables
// Deploy render-proxy/server.js on Render.com (FREE) - see render-proxy/README.md
// Then set PROXY_URL to your Render service URL (e.g., https://your-service.onrender.com)
const PROXY_URL = process.env.PROXY_URL;

// Timeout in milliseconds (Vercel free tier has 10s limit, so use 8s to be safe)
const REQUEST_TIMEOUT = 8000;
// Health check timeout - shorter, just to wake up the service
const HEALTH_CHECK_TIMEOUT = 3000;

const API_BASE_URL = 'https://api.clashroyale.com/v1';

// Helper function to make HTTPS request with timeout
function makeRequest(url, timeout) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ClashRoyaleDeckSuggester/1.0'
      },
      timeout: timeout
    };

    const request = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data, headers: res.headers });
      });
    });

    request.setTimeout(timeout, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();
  });
}

// Wake up the Render.com service by calling health endpoint
async function wakeUpService() {
  if (!PROXY_URL) return false;

  try {
    const healthUrl = `${PROXY_URL}/health`;
    await makeRequest(healthUrl, HEALTH_CHECK_TIMEOUT);
    return true;
  } catch (error) {
    // Health check failed, but that's okay - service might wake up anyway
    console.log('Health check failed (service might be waking up):', error.message);
    return false;
  }
}

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

  try {
    // First, try to wake up the service with a quick health check
    // This doesn't block - we do it in parallel but don't wait for it
    wakeUpService().catch(() => {
      // Ignore errors - this is just a wake-up call
    });

    // Make the actual request
    const result = await makeRequest(targetUrl, REQUEST_TIMEOUT);

    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      res.status(result.statusCode).send(result.data);
    }
  } catch (error) {
    console.error('Proxy request error:', error.message);

    if (!res.headersSent) {
      if (error.message === 'Request timeout') {
        res.status(504).json({
          error: 'Gateway Timeout',
          message: 'The proxy server took too long to respond. This often happens if the Render.com service is sleeping (free tier).',
          suggestion: 'The service is waking up. Please try again in 5-10 seconds.',
          timeout: REQUEST_TIMEOUT
        });
      } else {
        res.status(502).json({
          error: 'Bad Gateway',
          message: error.message || 'Failed to connect to proxy server',
          suggestion: 'Check if PROXY_URL is correct and the proxy service is running on Render.com'
        });
      }
    }
  }
};
