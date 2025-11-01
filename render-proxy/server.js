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

  https.get(apiUrl, options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.status(apiRes.statusCode).send(data);
    });
  }).on('error', (error) => {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  });
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

