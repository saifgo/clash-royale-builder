# FREE Proxy Setup - Render.com (2 Minutes!)

## ⚡ Quick Deploy on Render.com (100% FREE)

Render.com provides **free static IPs** and is perfect for this proxy. Follow these steps:

### Step 1: Create Render Account (30 seconds)
1. Go to **[render.com](https://render.com)** and sign up (free)
2. Sign up with GitHub (easiest)

### Step 2: Deploy Proxy (1 minute)

1. **Click "New +" → "Web Service"**

2. **Connect Repository** (choose one):
   - **Option A**: Connect GitHub repo (if you have one)
   - **Option B**: Use "Public Git Repository" 
     - URL: `https://github.com/your-username/your-repo` (or create a new repo)
   - **Option C**: Manual Deploy (easiest for testing):
     - Click "Manual Deploy"
     - Upload the files from `render-proxy/` folder:
       - `server.js`
       - `package.json`

3. **Configure Settings**:
   - **Name**: `clash-royale-proxy` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install` (auto-detected)
   - **Start Command**: `node server.js`
   - **Plan**: Select **"Free"** ✅

4. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add: `API_TOKEN` = your Clash Royale API token
   - Click "Add"

5. **Click "Create Web Service"**

6. **Wait 2-3 minutes** for deployment

### Step 3: Get Static IP (30 seconds)

1. Once deployed, Render gives you a URL like: `https://clash-royale-proxy.onrender.com`

2. **Get Static IP**:
   - Go to your service → **Settings** → **Network**
   - Look for **"Outbound IPs"** or check the service logs
   - Or use: `nslookup your-service.onrender.com` in terminal
   - **Note the IP address** (e.g., `216.24.57.1`)

### Step 4: Whitelist IP in Clash Royale Portal (30 seconds)

1. Go to **[developer.clashroyale.com](https://developer.clashroyale.com)**
2. Edit your API token
3. Add the Render static IP to whitelist
4. Save changes

### Step 5: Configure Vercel (30 seconds)

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add: `PROXY_URL` = `https://your-service.onrender.com`
3. **Redeploy** your Vercel app

### ✅ Done!

Your Vercel app will now use the Render proxy, which has a static IP that's whitelisted!

## Test Your Proxy

Test directly:
```
https://your-service.onrender.com/api/player/YOURTAG
```

Or:
```
https://your-service.onrender.com/api/player?tag=YOURTAG
```

## Render.com Free Tier

✅ **Completely FREE**  
✅ **Static IPs** included  
✅ **Automatic HTTPS**  
✅ **No credit card required**  
✅ **Auto-deploys from Git**  

**Limitations** (for free tier):
- Service sleeps after 15 minutes of inactivity (wakes up on first request)
- 750 hours/month free (plenty for most use cases)

## Alternative: Railway.app (Also Free)

1. Go to **[railway.app](https://railway.app)**
2. Sign up with GitHub
3. Click "New Project" → "Empty Service"
4. Upload `server.js` and `package.json` from `render-proxy/` folder
5. Add environment variable: `API_TOKEN`
6. Railway auto-generates domain and static IP
7. Get IP from Railway dashboard or logs
8. Whitelist IP in Clash Royale portal
9. Set `PROXY_URL` in Vercel

## Troubleshooting

### Proxy returns 403
- Check IP is whitelisted in Clash Royale portal
- Verify `API_TOKEN` is set in Render environment variables
- Check Render service logs

### Service is sleeping (Render free tier)
- First request after 15 min inactivity takes ~30 seconds
- Subsequent requests are instant
- Consider upgrading to paid plan if needed ($7/month)

### How to find Render IP
- Check service logs: `nslookup your-service.onrender.com`
- Or check Render dashboard → Network settings

## Why Render.com?

✅ **100% Free** for this use case  
✅ **Static IPs** automatically  
✅ **Easy deployment** (2 minutes)  
✅ **No credit card** needed  
✅ **Automatic HTTPS**  
✅ **Reliable** uptime  

## File Structure

```
render-proxy/
├── server.js       # Proxy server code
├── package.json    # Dependencies
└── README.md       # This file (deployment instructions)
```

## Next Steps

1. ✅ Deploy proxy on Render.com (2 minutes)
2. ✅ Get static IP from Render
3. ✅ Whitelist IP in Clash Royale portal
4. ✅ Set `PROXY_URL` in Vercel environment variables
5. ✅ Test your Vercel deployment

That's it! Your proxy is now live and free! 🎉

