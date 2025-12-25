# 🚀 Add to Replit - Step-by-Step Guide

Follow these exact steps to deploy your backend to Replit.

## Step 1: Go to Replit

1. Open browser and go to **https://replit.com**
2. Sign up or log in with GitHub (easier)

## Step 2: Create New Replit Project

1. Click **"Create Replit"** button
2. Choose **"Import from GitHub"**
3. Paste your GitHub repository URL:
   ```
   https://github.com/YOUR-USERNAME/ytDownloader-main
   ```
4. Click **Import**
5. Wait 1-2 minutes for import to complete

## Step 3: Add Secrets (IMPORTANT!)

1. On the left sidebar, find the **🔒 Secrets** icon (lock icon)
2. Click it to open Secrets panel
3. Add these three secrets:

**Secret 1:**
```
Key: NODE_ENV
Value: production
```
Click "Add Secret"

**Secret 2:**
```
Key: MAX_FILE_SIZE_MB
Value: 500
```
Click "Add Secret"

**Secret 3:**
```
Key: FRONTEND_URL
Value: (leave blank for now, update later)
```
Click "Add Secret"

## Step 4: Install Dependencies

1. Click the **"Shell"** tab at the top
2. Run this command:
   ```bash
   cd web
   npm install
   ```
3. Wait 1-2 minutes for installation

## Step 5: Install yt-dlp

In the Shell, run:
```bash
pip install yt-dlp
```

This takes about 30 seconds.

## Step 6: Start the Server

In the Shell, run:
```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:3000
📡 API available at http://localhost:3000/api
```

## Step 7: Get Your Backend URL

Look at the top of the Replit window. You'll see a URL like:

```
https://ytdownloader-backend-abc123xyz.replit.dev
```

**⭐ COPY THIS URL** - You'll need it for the frontend!

## Step 8: Update Secrets with Vercel URL (After Deploying Frontend)

Once you've deployed to Vercel and have your frontend URL:

1. Go back to **🔒 Secrets**
2. Update the `FRONTEND_URL` secret:
   ```
   Key: FRONTEND_URL
   Value: https://your-vercel-domain.vercel.app
   ```
3. Go back to Shell tab
4. Restart server (Ctrl+C) then run: `npm start`

## ✅ Your Backend is Live!

You now have:
- ✅ Backend running on Replit
- ✅ yt-dlp installed and ready
- ✅ API endpoints accessible
- ✅ Your Replit URL ready to share

## 🧪 Test It Works

In terminal, run:
```bash
curl https://your-replit-url.replit.dev/api/health
```

You should see:
```json
{"status":"ok","timestamp":"2024-12-24T..."}
```

## 📝 Important Notes

- **Keep the Shell tab open** - Your server keeps running while you browse
- **Auto-save** - Replit auto-saves all your code
- **Restart server** - If needed, Ctrl+C then `npm start`
- **Update yt-dlp** - If downloads fail: `pip install -U yt-dlp`

## 🔗 Next Steps

1. ✅ Backend deployed on Replit ✓
2. ⏳ Deploy frontend on Vercel (see DEPLOY_VERCEL.md)
3. ⏳ Update Replit CORS settings
4. ⏳ Test together

## 🆘 Troubleshooting

### "npm command not found"
- Replit has Node.js pre-installed
- Make sure you're in the web folder: `cd web`

### "pip install yt-dlp fails"
- Try: `pip3 install yt-dlp`
- Or: `python -m pip install yt-dlp`

### "npm start fails"
- Check you did `npm install` first
- Check you're in the web folder: `cd web`

### "Port 3000 already in use"
- Replit assigns ports automatically, this shouldn't happen
- Restart Replit if stuck

### "Can't see server output"
- Make sure you're in the Shell tab
- Server output shows in real-time there

## 📊 What's Running

```
Your Replit Project
├── Node.js v18+
├── npm (package manager)
├── Python 3.7+
├── yt-dlp (video downloader)
└── Express server on port 3000
```

## 🎉 Success Checklist

- [ ] Replit project created
- [ ] Code imported from GitHub
- [ ] Secrets added (NODE_ENV, MAX_FILE_SIZE_MB)
- [ ] npm install completed
- [ ] yt-dlp installed
- [ ] Server started (npm start)
- [ ] See "Server running on..." message
- [ ] Replit URL copied

**Next:** Deploy frontend to Vercel! 🚀
