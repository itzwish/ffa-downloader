# Split Deployment Guide: Replit Backend + Vercel Frontend

Deploy your YouTube downloader with backend on Replit and frontend on Vercel.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Frontend                       │
│         (HTML/CSS/JS - Static Website)                  │
│      https://ytdownloader.vercel.app                    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS Requests
                     │ API Calls
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   Replit Backend                        │
│      (Node.js + yt-dlp + FFmpeg)                        │
│   https://ytdownloader-backend.replit.dev              │
└─────────────────────────────────────────────────────────┘
```

## Quick Setup (15 minutes)

### 1. Deploy Backend to Replit

**Prerequisites:**
- GitHub account
- Replit account

**Steps:**
1. Push code to GitHub
2. Go to [replit.com](https://replit.com)
3. Click "Import from GitHub"
4. Select your repository
5. In Replit Secrets (🔒 icon), add:
   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   MAX_FILE_SIZE_MB=500
   ```
6. In Shell, run:
   ```bash
   cd web
   npm install
   npm start
   ```
7. **Copy your Replit URL** (shown at top)
   - Format: `https://replit-projectname-username.replit.dev`

### 2. Deploy Frontend to Vercel

**Prerequisites:**
- Vercel account (login with GitHub)

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Select your GitHub repo
4. Change **Root Directory** to `web/public`
5. Click "Deploy"
6. After deployment, add Environment Variable:
   - Go to **Settings** → **Environment Variables**
   - Add: `REACT_APP_API_URL=https://your-replit-url.replit.dev`
7. Click **"Redeploy"** to apply changes

### 3. Update Frontend to Use Backend URL

Edit `web/public/app.js` (around line 10-20):

Find this:
```javascript
const API_URL = 'http://localhost:3000';
```

Change to:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://your-replit-url.replit.dev';
```

Push to GitHub → Vercel auto-redeploys!

### 4. Test It Works

1. Open your Vercel URL
2. Paste a YouTube URL
3. Click "Fetch Info"
4. If it works → ✅ You're done!

## Detailed Guides

- **[Replit Backend Deployment](./DEPLOY_REPLIT.md)** - Full setup & troubleshooting
- **[Vercel Frontend Deployment](./DEPLOY_VERCEL.md)** - Complete frontend guide

## File Structure

```
ytDownloader/
├── web/
│   ├── public/
│   │   ├── index.html          ← Deployed to Vercel
│   │   ├── app.js
│   │   └── styles.css
│   ├── routes/
│   ├── utils/
│   ├── server.js               ← Deployed to Replit
│   ├── package.json
│   └── DEPLOY_REPLIT.md        ← Read this
├── DEPLOY_VERCEL.md            ← Read this
└── README.md
```

## Environment Variables Summary

### Replit (Backend)

```env
NODE_ENV=production
FRONTEND_URL=https://your-vercel-domain.vercel.app
MAX_FILE_SIZE_MB=500
PORT=3000
```

### Vercel (Frontend)

```env
REACT_APP_API_URL=https://your-replit-backend.replit.dev
```

## API Endpoints

Your frontend will call these endpoints on the Replit backend:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Check backend is alive |
| `/api/info` | POST | Get video metadata |
| `/api/download/start` | POST | Start download |
| `/api/download/status/:id` | GET | Check download progress |
| `/api/download/file/:id` | GET | Download the file |
| `/api/download/:id` | DELETE | Cancel download |

## Features & Limits

| Feature | Replit | Vercel |
|---------|--------|--------|
| Hosting | Free tier | Free tier |
| Uptime | ~95% | 99.9%+ |
| Bandwidth | Generous | Unlimited |
| Compute | Limited | Not needed (static) |
| Storage | Limited | Not needed (static) |
| Auto-scaling | No | Yes |
| Max file | 500MB (configurable) | N/A |

## Troubleshooting

### Frontend shows blank page
- Check browser console (F12)
- Verify REACT_APP_API_URL in Vercel settings
- Ensure Replit backend is running

### API calls fail (CORS error)
- Check FRONTEND_URL in Replit Secrets
- Must match your Vercel domain exactly
- Restart Replit server after changing

### Download fails
- Check `MAX_FILE_SIZE_MB` in Replit
- Verify yt-dlp is installed: `pip list | grep yt-dlp`
- Check Replit storage quota

### Backend timeout
- Replit has resource limits
- Download large videos on high quality may timeout
- Try lower quality (480p, 360p)

## Updating Code

### Update Backend (Replit)
1. Edit files in `web/`
2. Push to GitHub
3. Replit pulls changes (if auto-pull enabled)
4. Restart the server

### Update Frontend (Vercel)
1. Edit files in `web/public/`
2. Push to GitHub
3. Vercel auto-deploys
4. Changes live in ~30 seconds

## Performance Tips

1. **Limit concurrent downloads:** Backend can't handle too many at once
2. **Keep file size reasonable:** Use 480p or lower for large videos
3. **Audio-only downloads:** Much faster and smaller
4. **Monitor storage:** Delete old files from Replit
5. **Consider paid tiers** if you need:
   - Larger file sizes
   - More concurrent downloads
   - Better uptime guarantees

## Cost

**Total: Free** (both platforms have generous free tiers)

- Replit free: Enough for moderate use
- Vercel free: Unlimited bandwidth & deployments

Consider upgrading if you get heavy traffic.

## Security Notes

✅ **Good practices:**
- Frontend is served from Vercel (CDN)
- Backend doesn't serve static files in production
- CORS restricts to your Vercel domain
- Input validation on all API calls
- Environment variables for secrets

⚠️ **Remember:**
- Don't commit `.env` files to GitHub
- Use Replit/Vercel secrets management
- Monitor API rate limits if public

## Support & Resources

- **Replit Docs:** https://docs.replit.com
- **Vercel Docs:** https://vercel.com/docs
- **yt-dlp Docs:** https://github.com/yt-dlp/yt-dlp
- **Express.js:** https://expressjs.com

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy backend to Replit
3. ✅ Deploy frontend to Vercel
4. ✅ Update environment variables
5. ✅ Test the connection
6. ✅ Share your URL!

You're now running a distributed YouTube downloader! 🚀

---

**Questions?** Check the detailed guides:
- [DEPLOY_REPLIT.md](./DEPLOY_REPLIT.md)
- [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)
