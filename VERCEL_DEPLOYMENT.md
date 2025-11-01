# Clash Royale API - Vercel Deployment Guide

## ⚠️ CRITICAL: IP Whitelisting Issue with Vercel

### The Problem

When deploying to Vercel, your serverless functions run on **dynamic IP addresses** that change with each invocation. This means:

- ❌ **IP whitelisting WILL NOT WORK** with Vercel
- ❌ Each function invocation may use a different IP address
- ❌ You cannot predict or whitelist these IPs

### The Solution: Remove IP Restrictions

**You MUST remove IP restrictions from your API token** for Vercel deployment.

## Step-by-Step Fix

### 1. Go to Clash Royale Developer Portal

Visit: [https://developer.clashroyale.com/](https://developer.clashroyale.com/)

### 2. Edit Your API Token

1. Log in to your account
2. Navigate to **"My Account"** or **"API Keys"**
3. Find your API token
4. Click **"Edit"** or **"Manage"**

### 3. Remove IP Restrictions

1. Find the **"IP Restrictions"** or **"Authorized IPs"** section
2. **Remove all IP addresses** from the whitelist
3. **OR** set it to allow all IPs (0.0.0.0/0 or empty)
4. Click **"Save"** or **"Update"**

### 4. Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `API_TOKEN`
   - **Value:** Your Clash Royale API token (without IP restrictions)
   - **Environment:** Production, Preview, Development (select all)
4. Click **"Save"**
5. **Redeploy** your application

### 5. Verify It Works

After deployment, test your API endpoint:
```
https://your-app.vercel.app/api/player?tag=YOURTAG
```

## Security Considerations

### Is It Safe to Remove IP Restrictions?

**YES**, because:

1. ✅ Your API token is stored securely in Vercel's environment variables
2. ✅ The token is never exposed to the client-side code
3. ✅ All API requests go through your serverless function (not directly from browser)
4. ✅ The token itself is protected - only someone with Vercel access can see it

### Best Practices

1. ✅ **Use environment variables** - Never hardcode tokens
2. ✅ **Use different tokens** - Separate tokens for dev/prod if possible
3. ✅ **Rotate tokens** - Change them periodically
4. ✅ **Monitor usage** - Check your developer portal for unusual activity
5. ✅ **Limit scope** - Only grant necessary permissions

## Alternative Solutions (If You Must Use IP Whitelisting)

If you absolutely need IP whitelisting, you have these options:

### Option A: Use a Fixed IP Proxy Service

1. Deploy a proxy server on a service with fixed IP:
   - **AWS Lambda** with VPC NAT Gateway (static IP)
   - **Google Cloud Functions** with VPC connector
   - **A dedicated VPS** with static IP

2. Have your Vercel function call the proxy instead of API directly

3. Whitelist the proxy's IP in Clash Royale developer portal

**This is more complex and not recommended unless you have specific security requirements.**

### Option B: Use Different Tokens

1. Keep IP restrictions for local development token
2. Create a separate token without IP restrictions for Vercel
3. Use different tokens in different environments

## For Local Development

If you want IP whitelisting for local development:

1. Keep IP restrictions on your local development token
2. Use the `server.js` file for local development:
   ```bash
   npm start
   ```
3. The local server will use your whitelisted IP
4. Set your local IP in the developer portal

## Troubleshooting

### Error: `accessDenied.invalidIp`
- **Cause:** Your API token still has IP restrictions
- **Solution:** Remove IP restrictions from the developer portal

### Error: `Server configuration error: API token not found`
- **Cause:** `API_TOKEN` environment variable not set in Vercel
- **Solution:** Set `API_TOKEN` in Vercel environment variables and redeploy

### Error: `403 Forbidden`
- **Cause:** Invalid API token or token still has IP restrictions
- **Solution:** 
  1. Verify token is valid in developer portal
  2. Confirm IP restrictions are removed
  3. Check `API_TOKEN` is set correctly in Vercel
  4. Redeploy after making changes

### Error: `401 Unauthorized`
- **Cause:** Expired or invalid token
- **Solution:** Generate a new token in the developer portal

## Summary

✅ **Remove IP restrictions** from your API token  
✅ **Set `API_TOKEN`** in Vercel environment variables  
✅ **Redeploy** your application  
✅ **Your token is secure** - it's server-side only  

Your API token is protected because:
- It's stored in Vercel's secure environment variables
- It's never exposed to client-side code
- All requests go through your serverless function

