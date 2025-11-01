# Proxy Server Setup Guide

## The Problem

The Clash Royale developer portal **requires at least one IP address** to be whitelisted, but Vercel uses **dynamic IPs** that change with each invocation.

## The Solution: Proxy Server with Static IP

Deploy a simple proxy server on a service with a **static/fixed IP address**, then whitelist that IP in the Clash Royale developer portal.

## Quick Setup Options

### Option 1: Free VPS Services (Recommended)

#### A. Railway.app (Easiest)
1. Go to [railway.app](https://railway.app) and sign up
2. Create a new project
3. Add a new service → **Empty Service**
4. Upload the `proxy-server.js` and `proxy-package.json` files
5. Set environment variable: `API_TOKEN` = your Clash Royale token
6. Railway provides a static IP - use that IP in Clash Royale portal
7. Copy the Railway URL (e.g., `https://your-app.railway.app`)
8. Set `PROXY_URL` in Vercel environment variables to this URL

#### B. Render.com
1. Go to [render.com](https://render.com) and sign up
2. Create a new **Web Service**
3. Connect your repository or upload files
4. Set build command: `npm install`
5. Set start command: `node proxy-server.js`
6. Set environment variable: `API_TOKEN`
7. Render provides static IPs - check your service settings
8. Set `PROXY_URL` in Vercel to your Render URL

#### C. Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run: `fly launch`
3. Set secrets: `fly secrets set API_TOKEN=your-token`
4. Deploy: `fly deploy`
5. Get IP: `fly ips list`
6. Whitelist that IP in Clash Royale portal
7. Set `PROXY_URL` in Vercel to your Fly.io URL

### Option 2: Cloud Providers (More Control)

#### AWS EC2 (Free Tier Available)
1. Launch an EC2 instance (t2.micro - free tier eligible)
2. Allocate an Elastic IP (free if attached to running instance)
3. SSH into instance and install Node.js
4. Upload `proxy-server.js` and `proxy-package.json`
5. Install dependencies: `npm install`
6. Run with PM2: `pm2 start proxy-server.js`
7. Whitelist the Elastic IP in Clash Royale portal
8. Set `PROXY_URL` in Vercel to `http://your-elastic-ip:3000` or use a domain

#### Google Cloud Platform (Free Tier)
1. Create a Compute Engine VM instance
2. Reserve a static IP address
3. Install Node.js and deploy the proxy server
4. Whitelist the static IP in Clash Royale portal
5. Set `PROXY_URL` in Vercel

#### Oracle Cloud (Always Free Tier)
1. Create a VM instance (always free)
2. Reserve a public IP
3. Install Node.js and deploy proxy
4. Whitelist IP in Clash Royale portal
5. Set `PROXY_URL` in Vercel

### Option 3: Simple VPS Providers

- **DigitalOcean Droplet** ($5/month) - Easy setup
- **Linode** ($5/month) - Simple interface
- **Vultr** ($5/month) - Good performance

## Step-by-Step: Railway.app (Easiest Method)

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2. Deploy Proxy Server
1. Click **"New Project"**
2. Click **"Empty Service"**
3. Click **"Settings"** → **"Generate Domain"** (note your URL)
4. Click **"Variables"** tab
5. Add variable: `API_TOKEN` = your Clash Royale API token
6. Click **"Deploy"** → **"Upload Files"**
7. Upload `proxy-server.js` and `proxy-package.json`
8. Rename `proxy-package.json` to `package.json` in Railway
9. Railway will auto-detect Node.js and deploy

### 3. Get Static IP
1. Railway provides static IPs automatically
2. Check your service logs or use: `nslookup your-app.railway.app`
3. Or check Railway dashboard → Network settings

### 4. Whitelist IP in Clash Royale Portal
1. Go to [developer.clashroyale.com](https://developer.clashroyale.com)
2. Edit your API token
3. Add the Railway static IP to whitelist
4. Save changes

### 5. Configure Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `PROXY_URL` = `https://your-app.railway.app`
3. Redeploy

## Testing the Proxy

Test your proxy directly:
```bash
curl https://your-proxy.railway.app/api/player/YOURTAG
```

Or visit in browser:
```
https://your-proxy.railway.app/api/player/YOURTAG
```

## File Structure for Proxy Deployment

```
proxy-server/
├── proxy-server.js    (rename this to server.js or index.js)
├── package.json       (use proxy-package.json content)
└── .env              (optional, for local testing)
```

## Security Notes

✅ **API Token is Safe**: The proxy stores your token server-side only  
✅ **No Client Exposure**: Token never reaches the browser  
✅ **HTTPS Only**: Use HTTPS for your proxy URL  
✅ **Static IP**: Only one IP needs to be whitelisted  

## Troubleshooting

### Proxy returns 403
- Check that IP is whitelisted in Clash Royale portal
- Verify `API_TOKEN` is set correctly in proxy environment
- Check proxy server logs

### Vercel can't reach proxy
- Verify `PROXY_URL` is set correctly in Vercel
- Check proxy server is running and accessible
- Test proxy URL directly in browser

### How to find static IP
- **Railway**: Check service logs or network settings
- **Render**: Service settings → Network → Outbound IPs
- **Fly.io**: Run `fly ips list`
- **EC2**: Check Elastic IP in AWS console

## Cost Comparison

| Service | Cost | Static IP | Setup Difficulty |
|---------|------|-----------|------------------|
| Railway | Free (paid plans available) | ✅ Yes | ⭐ Easy |
| Render | Free (paid plans available) | ✅ Yes | ⭐ Easy |
| Fly.io | Free tier | ✅ Yes | ⭐⭐ Medium |
| AWS EC2 | Free tier (12 months) | ✅ Yes (Elastic IP) | ⭐⭐⭐ Complex |
| Oracle Cloud | Always free | ✅ Yes | ⭐⭐⭐ Complex |
| DigitalOcean | $5/month | ✅ Yes | ⭐⭐ Medium |

## Recommended: Railway.app

**Why Railway?**
- ✅ Free tier available
- ✅ Automatic static IPs
- ✅ Easy deployment (just upload files)
- ✅ Automatic HTTPS
- ✅ Good free tier limits
- ✅ Simple interface

## Next Steps

1. ✅ Deploy proxy server on Railway/Render/Fly.io
2. ✅ Get the static IP address
3. ✅ Whitelist IP in Clash Royale developer portal
4. ✅ Set `PROXY_URL` in Vercel environment variables
5. ✅ Test your Vercel deployment

Your Vercel function will now call the proxy, which has a static IP that's whitelisted!

