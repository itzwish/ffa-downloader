# Migration Guide: Electron to Web

This guide explains how the desktop app has been converted to a web application and what differences exist.

## Architecture Changes

### Before (Electron Desktop App)
```
Main Process (Node.js + Electron APIs)
    ↓
Renderer Process (Chromium Window)
    ↓
IPC Channels
    ↓
yt-dlp & FFmpeg (Local Binaries)
```

### After (Web Application)
```
Frontend (HTML/CSS/JS Browser)
    ↓ (HTTP)
Express Server (Node.js)
    ↓
yt-dlp & FFmpeg (System Tools)
    ↓
Downloaded File (Streamed to Browser)
```

## Feature Comparison

| Feature | Desktop | Web | Notes |
|---------|---------|-----|-------|
| Download MP4 | ✅ | ✅ | Same functionality |
| Extract MP3 | ✅ | ✅ | Same functionality |
| Quality Selection | ✅ | ✅ | UI simplified |
| Download History | ✅ | ❌ | By design (privacy) |
| System Tray | ✅ | ❌ | Not applicable |
| Auto-update | ✅ | ❌ | Deploy to update |
| Local Storage | ✅ | ✅ | IndexedDB for settings |
| Offline Mode | ✅ | ❌ | Requires internet |
| Multiple Downloads | ✅ | ✅ | Limited by tier |

## Code Mapping

### Frontend Files

**Desktop → Web**
```
src/index.js          → web/public/app.js
html/index.html       → web/public/index.html
assets/css/index.css  → web/public/styles.css
src/renderer.js       → app.js (simplified)
src/common.js         → app.js (merged)
```

### Backend Files

**Desktop → Web (New)**
```
server.js                 ← Express server (new)
routes/download.js        ← Download API (new)
routes/info.js           ← Video info API (new)
utils/mediaProcessor.js  ← Media handling (adapted)
```

## API Conversion

### IPC Channels → HTTP APIs

**Desktop (IPC):**
```javascript
// main.js
ipcMain.handle('download-video', async (event, url) => {
  // Download logic
});

// renderer.js
const result = await ipcRenderer.invoke('download-video', url);
```

**Web (HTTP):**
```javascript
// Backend: routes/download.js
app.post('/api/download/start', async (req, res) => {
  // Download logic
});

// Frontend: app.js
const response = await fetch('/api/download/start', {
  method: 'POST',
  body: JSON.stringify({ url })
});
```

## Database Changes

### Desktop Version
- Local JSON files in user data directory
- Electron's native file system access

### Web Version
- No persistent storage (by design)
- Browser IndexedDB for UI settings
- Server-side session management via in-memory Map

## Installation Differences

### Desktop App
```bash
# Download installer (.exe, .dmg, .AppImage)
# Run executable
# Auto-updates available
```

### Web App
```bash
# npm install + npm start
# Or Docker: docker-compose up
# Or cloud deploy: fly deploy
```

## Deployment

### Before (Distributable)
- Package as standalone executable
- Include FFmpeg/yt-dlp binaries
- Auto-update system required
- OS-specific builds

### After (Web Service)
- Single codebase for all platforms
- Hosted on cloud (Fly.io, Railway, Replit)
- Update by deploying new version
- No installation needed by users

## User Experience Changes

### Improvements
✅ No installation required
✅ Works on any device with browser
✅ Always latest version
✅ Works on mobile
✅ No system resource drain
✅ No file cleanup needed
✅ Instant access

### Tradeoffs
⚠️ Requires internet connection
⚠️ Depends on server uptime
⚠️ No offline capability
⚠️ Limited free tier resources
⚠️ No download history saved
⚠️ Shared infrastructure

## Configuration Migration

### Electron config (ytdownloader.json)
```json
{
  "bounds": { "width": 800, "height": 600 },
  "defaultFormat": "mp4",
  "theme": "dark",
  "language": "en",
  "downloadPath": "/home/user/Downloads"
}
```

### Web equivalent (.env + localStorage)
```javascript
// Server (.env)
PORT=3000
NODE_ENV=production

// Client (localStorage)
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'en');
// Downloads go to browser's download folder
```

## Performance Impact

### Desktop Version
- **Memory**: ~200-300 MB
- **Startup**: ~2-3 seconds
- **Download Speed**: Limited by disk I/O
- **Concurrent**: Multiple downloads
- **Storage**: Requires disk space for each download

### Web Version
- **Memory**: ~50 MB per session
- **Startup**: <1 second
- **Download Speed**: Streamed directly
- **Concurrent**: 1-10 (depends on tier)
- **Storage**: No local storage needed

## Troubleshooting Migration

### Issue: Can't find yt-dlp
```bash
# Solution: Install system-wide
pip install yt-dlp
yt-dlp --version
```

### Issue: FFmpeg not working
```bash
# Solution: Verify installation
ffmpeg -version
# Install if needed: brew install ffmpeg
```

### Issue: Port conflicts
```bash
# Solution: Change port
PORT=3001 npm start
```

### Issue: CORS errors
```javascript
// Already handled in server.js
// Check CORS origins if deploying elsewhere
app.use(cors()); // Allow all origins
```

## Development Tips

### Running Both Versions Simultaneously
```bash
# Terminal 1: Electron (old)
npm start

# Terminal 2: Web (new)
cd web && npm start
# Runs on different port, no conflicts
```

### Testing API Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Get video info
curl -X POST http://localhost:3000/api/info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Start download
curl -X POST http://localhost:3000/api/download/start \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","format":"mp4"}'
```

## Browser Compatibility

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✅ | ✅ | Recommended |
| Firefox | ✅ | ✅ | Fully supported |
| Safari | ✅ | ✅ | iOS 14+ |
| Edge | ✅ | ✅ | Chromium-based |
| Opera | ✅ | ✅ | Chromium-based |
| IE 11 | ❌ | ❌ | Not supported |

## Maintenance

### Keeping the Web App Updated

**Dependencies:**
```bash
npm outdated          # Check for updates
npm update            # Update packages
npm audit             # Check security
```

**Tools:**
```bash
pip install -U yt-dlp  # Update yt-dlp
brew upgrade ffmpeg    # Update FFmpeg
```

### Monitoring

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Logs:**
```bash
# Docker
docker-compose logs -f app

# Terminal
npm start 2>&1 | tee app.log
```

## Gradual Migration Strategy

### Phase 1: Parallel Running
- Keep Electron version available
- Run web version on separate port
- Let users test new interface

### Phase 2: Promote Web Version
- Recommend web version to new users
- Document limitations clearly
- Gather feedback

### Phase 3: Deprecate Desktop
- Archive Electron version
- Move to web-only distribution
- Update documentation

## Cost Implications

### Desktop Version
- 📦 Bandwidth: Distribution downloads
- 💾 Storage: Server for releases
- 🔄 Updates: Infrastructure for auto-updates

### Web Version
- 💰 Server hosting ($5-20/month)
- 📊 Bandwidth: Only active usage
- 🔄 Updates: Automatic on deploy
- ✅ Can use free tier initially

## Questions & Answers

**Q: Why remove download history?**
A: Privacy by design. No data stored = no privacy concerns.

**Q: Can we add back the history?**
A: Yes, with optional database (Firebase, PostgreSQL).

**Q: Why limit concurrent downloads?**
A: Free hosting constraints. Upgrade tier for more.

**Q: Can I self-host?**
A: Yes! Docker setup included. Full control.

**Q: Is there offline mode?**
A: Not for web version. Consider hybrid approach if needed.

---

**Need help?** Check INSTALLATION.md or README.md
