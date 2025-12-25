# Getting Started Visual Guide

## Step 1: Choose Your Path

```
┌─────────────────────────────────────────────────────────┐
│              HOW DO YOU WANT TO USE IT?                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  A) Just try it now        →  Path 1                   │
│     (run locally)                                       │
│                                                         │
│  B) Deploy to web           →  Path 2                  │
│     (share with friends)                               │
│                                                         │
│  C) Understand the code     →  Path 3                  │
│     (learn full-stack)                                 │
│                                                         │
│  D) Migrate from desktop    →  Path 4                  │
│     (compare versions)                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Path 1: Run Locally (5-10 minutes)

### Step 1.1: Check Prerequisites

```bash
# Check Node.js
$ node --version
v18.0.0 or higher ✅

# Check Python
$ python3 --version
3.7 or higher ✅

# Check FFmpeg
$ ffmpeg -version
4.0 or higher ✅
```

❌ Don't have them?
→ See [INSTALLATION.md](INSTALLATION.md) - Installation Steps

### Step 1.2: Install & Run

```bash
# Navigate to web folder
$ cd web

# Install dependencies
$ npm install

# Start server
$ npm start

# Output:
# 🚀 Server running on http://localhost:3000
# 📡 API available at http://localhost:3000/api
```

### Step 1.3: Open in Browser

```
Open browser → http://localhost:3000
↓
Paste YouTube URL
↓
Click "Get Video Info"
↓
Select format (MP4 or MP3)
↓
Choose quality
↓
Click "Start Download"
↓
Wait for completion
↓
Click download button
✅ Done!
```

### Step 1.4: Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `PORT=3001 npm start` |
| yt-dlp not found | `pip install yt-dlp` |
| FFmpeg not found | `brew install ffmpeg` |
| Permission error | Run with `sudo` or fix permissions |

→ More help? See [INSTALLATION.md - Troubleshooting](INSTALLATION.md#troubleshooting)

---

## Path 2: Deploy to Web (10-20 minutes)

### Choose Your Platform

```
┌──────────────────────────────────────────────┐
│     WHICH PLATFORM DO YOU PREFER?            │
├──────────────────────────────────────────────┤
│                                              │
│  💚 Replit        → Easiest, free tier      │
│  🚀 Fly.io        → Fast, good free tier    │
│  🚂 Railway       → User-friendly, cheap    │
│  🐳 Docker        → Self-hosted option      │
│                                              │
└──────────────────────────────────────────────┘
```

### Option A: Replit (Recommended for Beginners)

```
1. Go to https://replit.com
        ↓
2. Click "Create" → "Import from GitHub"
        ↓
3. Paste: https://github.com/aandrew-me/ytDownloader
        ↓
4. Click "Create Repl"
        ↓
5. Click "Run"
        ↓
6. Share the URL! 🎉
```

### Option B: Fly.io (Recommended for Production)

```bash
# 1. Install Fly CLI
#    https://fly.io/docs/getting-started/

# 2. Login
$ fly auth login

# 3. Deploy
$ cd web
$ fly launch
$ fly deploy

# 4. Get URL
$ fly apps info

✅ Your app is live at: https://app.fly.dev
```

### Option C: Railway (Easiest for GitHub Users)

```
1. Go to https://railway.app
        ↓
2. Login with GitHub
        ↓
3. Click "New Project" → "Deploy from GitHub"
        ↓
4. Select repository
        ↓
5. Railway auto-detects Node.js
        ↓
6. Done! 🎉
```

### Option D: Docker (For Full Control)

```bash
# Build and run locally
$ docker-compose up

# Test: http://localhost:3000

# Then deploy to any cloud supporting Docker
# (AWS, Azure, GCP, DigitalOcean, etc.)
```

→ Detailed guide? See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Path 3: Understand the Code (30-45 minutes)

### Architecture Overview

```
┌─────────────────┐
│   USER BROWSER  │  ← You (visiting in browser)
└────────┬────────┘
         │ HTTP
         ↓
┌──────────────────────────────────────────┐
│      EXPRESS SERVER (Node.js)            │
├──────────────────────────────────────────┤
│                                          │
│  Routes:                                 │
│  ├─ GET  /api/health                    │
│  ├─ POST /api/info                      │
│  └─ POST /api/download/start            │
│  ├─ GET  /api/download/status/:id       │
│  ├─ GET  /api/download/file/:id         │
│  └─ DELETE /api/download/:id            │
│                                          │
│  Utilities:                              │
│  ├─ mediaProcessor.js (yt-dlp)          │
│  └─ optimization.js (helpers)           │
│                                          │
└────────┬─────────┬──────────┬───────────┘
         │         │          │
         ↓         ↓          ↓
    ┌────────┐ ┌──────────┐ ┌──────┐
    │ yt-dlp │ │  FFmpeg  │ │ /tmp │
    │        │ │          │ │(files)
    └────────┘ └──────────┘ └──────┘
```

### Code Files to Read

1. **Start here:** `public/index.html` (60 lines)
   - Understand the UI structure

2. **Then:** `public/app.js` (400 lines)
   - See frontend logic and API calls

3. **Then:** `server.js` (30 lines)
   - Understand Express setup

4. **Then:** `routes/download.js` (100 lines)
   - See API endpoint implementation

5. **Then:** `utils/mediaProcessor.js` (200 lines)
   - Understand yt-dlp integration

6. **Finally:** `public/styles.css` (600 lines)
   - Learn responsive CSS

### Key Concepts to Understand

**Frontend:**
```javascript
// Make request to backend
fetch('/api/info', {
  method: 'POST',
  body: JSON.stringify({ url })
})
  .then(r => r.json())
  .then(data => displayInfo(data))
```

**Backend:**
```javascript
// Handle request
app.post('/api/info', async (req, res) => {
  const { url } = req.body;
  const info = await mediaProcessor.getVideoInfo(url);
  res.json(info);
});
```

**Media Processing:**
```javascript
// Download using yt-dlp
spawn('yt-dlp', ['-f', 'best', url])
  .on('close', (code) => {
    // File downloaded!
  });
```

### Learning Resources

| Topic | Document | Time |
|-------|----------|------|
| System Design | [ARCHITECTURE.md](ARCHITECTURE.md) | 20 min |
| API Details | [README.md](README.md#api-endpoints) | 10 min |
| Code Overview | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 10 min |
| Glossary | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | 5 min |

---

## Path 4: Migrate from Desktop (20-30 minutes)

### What Changed

```
DESKTOP VERSION              WEB VERSION
┌─────────────────┐         ┌──────────────────┐
│  Electron App   │    →    │  Browser App     │
├─────────────────┤         ├──────────────────┤
│ .exe/.dmg/.     │         │ https://url      │
│  AppImage       │         │ (any browser)    │
├─────────────────┤         ├──────────────────┤
│ Install first   │         │ No install       │
│                 │         │                  │
│ ~500MB          │         │ ~10MB            │
│                 │         │                  │
│ Single user     │         │ Anyone, anytime  │
│                 │         │                  │
│ Download history│         │ No history stored│
│                 │         │ (privacy)        │
└─────────────────┘         └──────────────────┘
```

### Feature Comparison

```
FEATURE                  DESKTOP    WEB
───────────────────────────────────────
Download MP4               ✅        ✅
Extract MP3                ✅        ✅
Multiple qualities         ✅        ✅
Progress bar              ✅        ✅
Download history          ✅        ❌
System tray               ✅        ❌
Offline mode              ✅        ❌
Mobile support            ❌        ✅
Installation required     ✅        ❌
Instant updates           ❌        ✅
```

### Code Mapping

```
DESKTOP                 WEB
src/index.js      →    public/app.js
html/index.html   →    public/index.html
assets/css/       →    public/styles.css
main.js (IPC)     →    routes/*.js (HTTP)
                       server.js (Express)
```

### Migration Checklist

- [ ] Review [MIGRATION.md](MIGRATION.md)
- [ ] Read feature comparison
- [ ] Compare performance
- [ ] Test web version
- [ ] Decide: Keep desktop or switch?
- [ ] If switching: Deploy to web
- [ ] Share with users
- [ ] Archive desktop version

→ Full guide? See [MIGRATION.md](MIGRATION.md)

---

## Quick Command Reference

### Installation
```bash
# Install system tools
brew install node python3 ffmpeg      # macOS
sudo apt install nodejs npm ffmpeg    # Linux
pip install yt-dlp

# Install Node dependencies
npm install

# Verify everything
yt-dlp --version
ffmpeg -version
node --version
```

### Development
```bash
# Run locally
npm start

# Change port
PORT=3001 npm start

# Run with Docker
docker-compose up

# Check health
curl http://localhost:3000/api/health
```

### Deployment
```bash
# Deploy to Fly.io
fly deploy

# Deploy to Replit
# (Just click "Run" after uploading)

# Deploy to Railway
# (Just connect GitHub)
```

### Troubleshooting
```bash
# Update yt-dlp
pip install -U yt-dlp

# Check logs
npm start 2>&1 | tee app.log

# Free up port
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## File Navigation

### Looking for...?

**How to get it running?**
→ [INSTALLATION.md](INSTALLATION.md)

**How to put it online?**
→ [DEPLOYMENT.md](DEPLOYMENT.md)

**How does it work?**
→ [ARCHITECTURE.md](ARCHITECTURE.md)

**Comparing with desktop?**
→ [MIGRATION.md](MIGRATION.md)

**Quick command?**
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Feature list?**
→ [README.md](README.md)

**Everything overview?**
→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

**All docs?**
→ [INDEX.md](INDEX.md)

---

## Recommended Reading Order

### For Users
```
1. README.md (features)
   ↓
2. INSTALLATION.md (local setup)
   ↓
3. Try it out!
   ↓
4. DEPLOYMENT.md (put online)
```

### For Developers
```
1. README.md (overview)
   ↓
2. ARCHITECTURE.md (design)
   ↓
3. INSTALLATION.md (setup)
   ↓
4. Read source code
   ↓
5. Modify & improve
```

### For DevOps
```
1. DEPLOYMENT.md (options)
   ↓
2. Choose platform
   ↓
3. Follow guide
   ↓
4. Deploy & monitor
```

---

## Decision Tree

```
START HERE
    │
    ├─ Do you have Node.js?
    │  ├─ No → Install (INSTALLATION.md)
    │  └─ Yes → Continue
    │
    ├─ Want to run locally?
    │  ├─ Yes → npm install && npm start
    │  └─ No → Skip to deployment
    │
    ├─ Want to deploy online?
    │  ├─ Yes → Choose platform (DEPLOYMENT.md)
    │  │  ├─ Replit? → Upload & run
    │  │  ├─ Fly.io? → fly deploy
    │  │  ├─ Railway? → Connect GitHub
    │  │  └─ Docker? → docker-compose up
    │  └─ No → Done!
    │
    └─ Want to understand code?
       ├─ Yes → ARCHITECTURE.md
       └─ No → You're done!
```

---

## Success Markers

You've succeeded when:

✅ App runs locally at `http://localhost:3000`
✅ You can paste a YouTube URL
✅ App fetches video information
✅ You can select format and quality
✅ Download completes successfully
✅ You can download the file

If deployed:
✅ URL is accessible from anywhere
✅ Works on mobile
✅ Friends can use it
✅ Multiple downloads work

---

## Troubleshooting at a Glance

| Error | Solution |
|-------|----------|
| `npm: command not found` | Install Node.js from nodejs.org |
| `yt-dlp: command not found` | `pip install yt-dlp` |
| `ffmpeg: command not found` | `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Linux) |
| `Port 3000 already in use` | `PORT=3001 npm start` |
| `Cannot find module` | `npm install` |
| `CORS error` | Check server.js CORS setup |
| `Download fails` | Update yt-dlp: `pip install -U yt-dlp` |

More help? → [INSTALLATION.md - Troubleshooting](INSTALLATION.md#troubleshooting)

---

## You're Ready! 🚀

Pick your path above and follow the guide. All documentation is complete and detailed.

**Questions?** Check the relevant markdown file.

**Ready to start?** Pick a path above! ⬆️

---

*Happy downloading!* 🎬🎵
