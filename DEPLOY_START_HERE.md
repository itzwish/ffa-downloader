# 🚀 Deployment Guide Summary

You're deploying ytDownloader with:
- **Backend on Replit** (Node.js + yt-dlp)
- **Frontend on Vercel** (Static HTML/CSS/JS)

## 📚 Documentation Structure

| Document | Purpose |
|----------|---------|
| **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** | ✅ Step-by-step deployment checklist (START HERE) |
| **[DEPLOY_SPLIT.md](./DEPLOY_SPLIT.md)** | 📋 Complete architecture & setup guide |
| **[DEPLOY_REPLIT.md](./web/DEPLOY_REPLIT.md)** | 🔧 Backend deployment details & troubleshooting |
| **[DEPLOY_VERCEL.md](./web/DEPLOY_VERCEL.md)** | 🌐 Frontend deployment details & troubleshooting |

## 🎯 Quick Start (TL;DR)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### 2. Deploy Backend (Replit)
1. Go to replit.com
2. Import your GitHub repository
3. Add Secrets: `NODE_ENV=production`, `MAX_FILE_SIZE_MB=500`
4. Run: `cd web && npm install && npm start`
5. Copy your Replit URL

### 3. Deploy Frontend (Vercel)
1. Go to vercel.com
2. Import your GitHub repository
3. Set Root Directory: `web/public`
4. Deploy
5. Add Environment Variable: `REACT_APP_API_URL=<your-replit-url>`
6. Redeploy

### 4. Test
- Open your Vercel URL
- Paste YouTube link
- Click "Fetch Info"
- Download works? ✅ You're done!

## 📁 File Structure for Deployment

```
Your Repository/
├── web/
│   ├── public/                 ← Deploy to Vercel
│   │   ├── index.html
│   │   ├── app.js
│   │   └── styles.css
│   ├── routes/                 ← Deploy to Replit
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── DEPLOY_REPLIT.md        ← Read for backend help
├── DEPLOY_VERCEL.md            ← Read for frontend help
├── DEPLOY_SPLIT.md             ← Read for architecture
├── DEPLOY_CHECKLIST.md         ← Read for step-by-step
└── README.md
```

## 🔐 Environment Variables

### Replit Backend
```env
NODE_ENV=production
FRONTEND_URL=https://your-vercel-domain.vercel.app
MAX_FILE_SIZE_MB=500
```

### Vercel Frontend
```env
REACT_APP_API_URL=https://your-replit-backend.replit.dev
```

## 🔄 How It Works

```
User opens Vercel frontend
         ↓
Enters YouTube URL
         ↓
Clicks "Fetch Info"
         ↓
Frontend sends HTTP request to Replit backend
         ↓
Backend uses yt-dlp to fetch metadata
         ↓
Returns video info to frontend
         ↓
User selects format & quality
         ↓
Frontend requests download from backend
         ↓
Backend downloads using yt-dlp
         ↓
File sent to browser
         ↓
User saves MP4 or MP3 ✅
```

## ⚙️ Key Files

| File | Purpose |
|------|---------|
| `web/server.js` | Express backend (Replit) |
| `web/public/app.js` | Frontend logic |
| `web/public/index.html` | UI structure |
| `web/public/styles.css` | Styling |
| `web/utils/mediaProcessor.js` | yt-dlp wrapper |
| `web/routes/download.js` | Download API endpoints |
| `web/routes/info.js` | Video info API endpoint |

## 🆘 Common Issues

**Frontend blank page?**
- Check browser console (F12)
- Verify `REACT_APP_API_URL` in Vercel settings
- Redeploy after changing env vars

**API call fails?**
- Verify Replit backend is running
- Check `FRONTEND_URL` in Replit matches Vercel domain exactly
- Look for CORS error in console

**Download fails?**
- yt-dlp may be outdated: `pip install -U yt-dlp`
- Try lower quality (480p instead of 1080p)
- Check file size isn't too large

**Need help?**
- Read appropriate guide above
- Check detailed troubleshooting sections
- Verify all env vars are set correctly

## 📊 Architecture Benefits

✅ **Frontend on Vercel:**
- Ultra-fast CDN (instant page load)
- Auto-scaling
- Global distribution
- Free tier is very generous

✅ **Backend on Replit:**
- Python pre-installed
- Easy to update
- Good for medium workloads
- Free tier sufficient for personal use

✅ **Separation:**
- Frontend can scale independently
- Backend focused on processing
- Easy to swap either service later
- Clear API contract between them

## 🎓 Learning Path

1. **First time?** → Read [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)
2. **Want details?** → Read [DEPLOY_SPLIT.md](./DEPLOY_SPLIT.md)
3. **Backend issues?** → Read [web/DEPLOY_REPLIT.md](./web/DEPLOY_REPLIT.md)
4. **Frontend issues?** → Read [web/DEPLOY_VERCEL.md](./web/DEPLOY_VERCEL.md)

## 🚀 Next Steps

1. ✅ Commit code to GitHub
2. ✅ Follow checklist in [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)
3. ✅ Test the connection
4. ✅ Share your Vercel URL

## 💡 Pro Tips

- Monitor Replit storage quota (delete old downloads)
- Set reasonable `MAX_FILE_SIZE_MB` for your plan
- Audio-only downloads are faster
- Keep yt-dlp updated: `pip install -U yt-dlp`
- Test locally first before deploying

---

**Ready to deploy?** Start with [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) 🎉
