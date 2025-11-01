// Proxy server for Clash Royale API
// Deploy this on Render.com (FREE) - they provide static IPs automatically
// This file is ready to deploy - just upload to Render.com

const https = require('https');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Your Clash Royale API Token (set as environment variable in Render)
const API_TOKEN = process.env.API_TOKEN || process.env.CLASH_ROYALE_API_TOKEN;
const API_BASE_URL = 'https://api.clashroyale.com/v1';

// API request timeout (25 seconds - Render free tier allows up to 30s)
const API_TIMEOUT = 25000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Clash Royale API Proxy is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Clash Royale API Proxy',
    endpoints: {
      health: '/health',
      player: '/api/player/:tag or /api/player?tag=YOURTAG'
    }
  });
});

// Helper function to make API request with timeout
function makeAPIRequest(apiUrl, options) {
  return new Promise((resolve, reject) => {
    const request = https.get(apiUrl, options, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        resolve({
          statusCode: apiRes.statusCode,
          data: data,
          headers: apiRes.headers
        });
      });
    });

    // Set timeout
    request.setTimeout(API_TIMEOUT, () => {
      request.destroy();
      reject(new Error('API request timeout'));
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Connection timeout'));
    });
  });
}

// Proxy endpoint - supports both /api/player/:tag and /api/player?tag=xxx
app.get('/api/player/:tag', async (req, res) => {
  const tag = req.params.tag.replace(/^#/, '').replace(/-/g, '');

  if (!tag) {
    return res.status(400).json({ error: 'Player tag is required' });
  }

  if (!API_TOKEN) {
    console.error('API_TOKEN not configured');
    return res.status(500).json({ 
      error: 'Proxy server configuration error: API_TOKEN not set. Please set it in Render environment variables.' 
    });
  }

  const apiUrl = `${API_BASE_URL}/players/%23${tag}`;

  const options = {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    }
  };

  try {
    const result = await makeAPIRequest(apiUrl, options);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(result.statusCode).send(result.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    if (error.message.includes('timeout')) {
      res.status(504).json({ 
        error: 'Gateway Timeout',
        message: 'The Clash Royale API took too long to respond',
        suggestion: 'Please try again'
      });
    } else {
      res.status(500).json({ 
        error: 'Proxy Error',
        message: error.message || 'Failed to fetch data from Clash Royale API'
      });
    }
  }
});

// Also support query parameter format
app.get('/api/player', (req, res) => {
  const tag = req.query.tag;
  if (!tag) {
    return res.status(400).json({ error: 'Player tag is required. Use ?tag=YOURTAG' });
  }
  // Redirect to the path-based endpoint
  return res.redirect(`/api/player/${tag}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Clash Royale API Proxy running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/api/player/:tag`);
  
  if (!API_TOKEN) {
    console.warn('⚠️  WARNING: API_TOKEN not set. Set it as an environment variable in Render.');
  } else {
    console.log('✅ API_TOKEN is configured');
  }
});

