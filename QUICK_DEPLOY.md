# 📌 Deployment Quick Reference

Copy-paste friendly guide for deploying to Replit + Vercel.

## Before You Start

Make sure you have:
- ✅ GitHub account & repository
- ✅ Replit account (free at replit.com)
- ✅ Vercel account (free at vercel.com)
- ✅ Code committed to GitHub

## Phase 1: Backend on Replit

### Create Replit Project
```
https://replit.com
→ Click "Create Replit"
→ Select "Import from GitHub"
→ Choose your repository
→ Wait for import
```

### Add Secrets (Click 🔒 icon)
```
NODE_ENV=production
FRONTEND_URL=https://your-vercel-domain.vercel.app
MAX_FILE_SIZE_MB=500
```
(Leave FRONTEND_URL blank for now, update later)

### Install & Run (In Shell tab)
```bash
cd web
npm install
pip install yt-dlp
npm start
```

### Get Your Backend URL
Look at top of Replit window. It shows something like:
```
https://ytdownloader-backend-username.replit.dev
```

**Save this URL! You'll need it for the frontend.**

---

## Phase 2: Frontend on Vercel

### Create Vercel Project
```
https://vercel.com
→ Click "Add New" → "Project"
→ Select "Import Git Repository"
→ Choose your repository
```

### Configure Build Settings
```
Root Directory: web/public
Build Command: (leave empty)
Install Command: (leave empty)
```

Then click **Deploy**.

### Get Your Frontend URL
After deployment, Vercel shows:
```
https://your-project-name.vercel.app
```

**Save this URL! You'll need it for Replit CORS.**

### Add Environment Variables
In Vercel Settings → Environment Variables:
```
Name: REACT_APP_API_URL
Value: https://your-replit-url.replit.dev
```

Then click **Redeploy**.

---

## Phase 3: Connect Them Together

### Update Replit CORS
1. Go back to Replit
2. Click Secrets (🔒)
3. Update: `FRONTEND_URL=https://your-vercel-domain.vercel.app`
4. Stop server (Ctrl+C in Shell)
5. Run: `npm start`

**Now they can talk to each other! ✅**

---

## Testing

### Test Backend
In any terminal:
```bash
curl https://your-replit-url.replit.dev/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2024-..."}
```

### Test Frontend
1. Open https://your-vercel-domain.vercel.app
2. Paste YouTube URL
3. Click "Fetch Info"
4. See video title & thumbnail → ✅ Working!

### Test Full Download
1. Select format (MP4 or Audio)
2. Pick quality
3. Click "Start Download"
4. See progress bar
5. File downloads → ✅ Success!

---

## Environment Variables Cheat Sheet

### Replit Secrets (Click 🔒)
```
NODE_ENV=production
FRONTEND_URL=https://your-vercel-domain.vercel.app
MAX_FILE_SIZE_MB=500
```

### Vercel Environment Variables
```
REACT_APP_API_URL=https://your-replit-url.replit.dev
```

---

## File Locations

| What | Where |
|------|-------|
| Backend | Replit: `/web/server.js` |
| Frontend | Vercel: `/web/public/` |
| Secrets | Replit: Click 🔒 |
| Env Vars | Vercel: Settings → Env Variables |

---

## Common Commands

### Replit Shell

Install Python package:
```bash
pip install yt-dlp
```

Start backend:
```bash
cd web && npm start
```

Stop backend:
```
Ctrl+C
```

Check yt-dlp:
```bash
yt-dlp --version
```

### Local Testing

Install dependencies:
```bash
npm install
```

Start locally:
```bash
npm run dev
```

Open in browser:
```
http://localhost:3000
```

---

## Troubleshooting Commands

### Check if yt-dlp works
```bash
yt-dlp --version
```

### Update yt-dlp
```bash
pip install -U yt-dlp
```

### Test API endpoint
```bash
curl https://your-replit-url.replit.dev/api/health
```

### Check environment variables set
Replit: Click 🔒 and see list
Vercel: Settings → Environment Variables

---

## URLs to Save

**Your Backend:**
```
https://_____.replit.dev
```

**Your Frontend:**
```
https://_____.vercel.app
```

---

## Checklist

- [ ] Code in GitHub
- [ ] Replit project created
- [ ] Replit secrets configured
- [ ] Backend running (`npm start`)
- [ ] yt-dlp installed
- [ ] Replit URL copied
- [ ] Vercel project created
- [ ] Root directory set to `web/public`
- [ ] Frontend deployed
- [ ] Vercel URL copied
- [ ] Env var `REACT_APP_API_URL` set
- [ ] Frontend redeployed
- [ ] Replit CORS updated with Vercel URL
- [ ] Backend restarted
- [ ] Backend health check working
- [ ] Frontend loads
- [ ] Fetch info works
- [ ] Download works

---

## If Something's Wrong

### Frontend shows blank
- Check browser console (F12) for errors
- Verify `REACT_APP_API_URL` in Vercel
- Redeploy Vercel

### API calls fail (CORS)
- Check `FRONTEND_URL` in Replit matches Vercel exactly
- Restart backend in Replit

### Download fails
- Install yt-dlp: `pip install yt-dlp`
- Try lower quality (480p)
- Check file size limit

### Need detailed help?
See documentation in root folder:
- `DEPLOY_START_HERE.md` - Overview
- `DEPLOY_CHECKLIST.md` - Step by step
- `DEPLOY_SPLIT.md` - Full architecture
- `web/DEPLOY_REPLIT.md` - Backend troubleshooting
- `web/DEPLOY_VERCEL.md` - Frontend troubleshooting

---

**You've got this! 🚀**
