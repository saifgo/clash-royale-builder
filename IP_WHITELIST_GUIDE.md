# IP Whitelisting Guide for Clash Royale API

## Your Current Situation

- **Your Public IP**: `196.178.103.32`
- **API Token IP Restriction**: `207.168.0.1` (doesn't match!)
- **Error**: `accessDenied.invalidIp` - API key does not allow access from IP 196.178.103.32

## Solution: Update IP Whitelist in Developer Portal

### Step 1: Get Your Public IP
Your public IP is: **196.178.103.32**

(This is the IP address that the Clash Royale API sees when your server makes requests)

### Step 2: Update Your API Token

1. Go to [developer.clashroyale.com](https://developer.clashroyale.com)
2. Log in to your account
3. Navigate to **"My Account"** or **"API Keys"**
4. Find your API token
5. Click **"Edit"** or **"Manage"**

### Step 3: Update IP Restrictions

You have two options:

#### Option A: Add Your Current IP (Recommended)
- Add this IP to the whitelist: `196.178.103.32`
- Click **"Save"** or **"Update"**

**Note:** If your IP changes (e.g., when you restart your router or connect to a different network), you'll need to update it again.

#### Option B: Remove IP Restrictions (Best for Development)
- Find the IP restriction/whitelist setting
- **Remove** or **clear** all IP addresses
- This allows requests from any IP address
- Click **"Save"** or **"Update"**

**Warning:** Removing IP restrictions is less secure but convenient for development. For production, use Option A.

### Step 4: Regenerate Token (If Needed)

Some portals require you to regenerate the token after changing IP settings:

1. Click **"Regenerate Token"** or **"Create New Token"**
2. Copy the new token
3. Update it in `server.js` (replace the `API_TOKEN` value)

### Step 5: Restart Your Server

After updating the IP whitelist:
```bash
# Stop the server (Ctrl+C)
# Then restart it
npm start
```

## Alternative: Check Your IP Address

If your IP changes frequently, you can check it anytime:
- Visit [whatismyip.com](https://whatismyip.com)
- Or use: `curl https://api.ipify.org` in terminal

## Troubleshooting

### "Still getting 403 error"
- Wait a few minutes for changes to propagate
- Try regenerating the token
- Check that you're editing the correct token

### "Can't find IP whitelist setting"
- Look for "Authorized IPs", "IP Restrictions", or "Client IPs"
- Some portals call it "CIDR" or "Whitelist"

### "IP keeps changing"
- Consider removing IP restrictions for development
- Or use a static IP/VPN service

---

**Your current public IP**: `196.178.103.32`  
**Add this to your whitelist, or remove IP restrictions entirely!**

