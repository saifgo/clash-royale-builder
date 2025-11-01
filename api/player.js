const https = require('https');

const API_TOKEN = process.env.API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImEzNzNmNmNmLTExMDQtNDNlMy1iZWJiLWNlMWJhYThmNGE0NSIsImlhdCI6MTc2MjAyMTA4MCwic3ViIjoiZGV2ZWxvcGVyL2RmZTg4ZjYzLTY3ODYtYTZkZi1jYzkzLTZhYTQ3NmJmZjRkZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxOTYuMTc4LjEwMy4zMiJdLCJ0eXBlIjoiY2xpZW50In1dfQ.0xWdti_OnDvnMxXlzj0yqIJtdx_GsLwIOJLIXb8voblAMvs0W0RNlfVu701bAdS09C1ISDXubHNaLUv4tu1fDg';
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
  const apiUrl = `${API_BASE_URL}/players/%23${tag}`;

  const options = {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    }
  };

  return new Promise((resolve, reject) => {
    https.get(apiUrl, options, (apiRes) => {
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
