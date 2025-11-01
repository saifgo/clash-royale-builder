// Simple Node.js proxy server for Clash Royale API
// This avoids CORS and IP whitelisting issues

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;
const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImEzNzNmNmNmLTExMDQtNDNlMy1iZWJiLWNlMWJhYThmNGE0NSIsImlhdCI6MTc2MjAyMTA4MCwic3ViIjoiZGV2ZWxvcGVyL2RmZTg4ZjYzLTY3ODYtYTZkZi1jYzkzLTZhYTQ3NmJmZjRkZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxOTYuMTc4LjEwMy4zMiJdLCJ0eXBlIjoiY2xpZW50In1dfQ.0xWdti_OnDvnMxXlzj0yqIJtdx_GsLwIOJLIXb8voblAMvs0W0RNlfVu701bAdS09C1ISDXubHNaLUv4tu1fDg';
const API_BASE_URL = 'https://api.clashroyale.com/v1';

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Parse the request URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Handle player data request
    if (pathname.startsWith('/api/player/')) {
        const playerTag = pathname.replace('/api/player/', '').replace(/#/g, '');
        const apiUrl = `${API_BASE_URL}/players/%23${playerTag}`;

        console.log(`Proxying request for player tag: ${playerTag}`);
        console.log(`API URL: ${apiUrl}`);

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
                res.writeHead(apiRes.statusCode, {
                    'Content-Type': 'application/json'
                });
                res.end(data);
            });
        }).on('error', (error) => {
            console.error('Proxy error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        });
    } else {
        // Serve static files
        const fs = require('fs');
        const path = require('path');

        let filePath = '.' + pathname;
        if (filePath === './') {
            filePath = './index.html';
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.woff2': 'font/woff2',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        // Special handling for service worker and manifest
        let contentType = mimeTypes[extname] || 'application/octet-stream';
        if (pathname === '/sw.js' || pathname === '/public/sw.js') {
            contentType = 'application/javascript';
        } else if (pathname === '/manifest.json' || pathname === '/public/manifest.json') {
            contentType = 'application/manifest+json';
        }

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 - File Not Found</h1>', 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${error.code}`, 'utf-8');
                }
            } else {
                const headers = {
                    'Content-Type': contentType
                };

                // Service worker must not be cached
                if (pathname === '/sw.js' || pathname === '/public/sw.js') {
                    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                    headers['Pragma'] = 'no-cache';
                    headers['Expires'] = '0';
                }
                // Manifest should be cached but can be revalidated
                else if (pathname === '/manifest.json' || pathname === '/public/manifest.json') {
                    headers['Cache-Control'] = 'public, max-age=3600';
                }
                // Icons can be cached for a long time
                else if (pathname.includes('/icons/')) {
                    headers['Cache-Control'] = 'public, max-age=31536000';
                }

                res.writeHead(200, headers);
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
    console.log(`📝 Open your browser and go to: http://localhost:${PORT}/`);
    console.log(`🔑 API Token is configured in the server`);
});

