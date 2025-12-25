# Quick Reference Guide

## Start Server

```bash
# Local development
npm start

# With custom port
PORT=3001 npm start

# With Docker
docker-compose up
```

## Install Dependencies

```bash
# Node packages
npm install

# System tools (macOS)
brew install node python3 ffmpeg
pip install yt-dlp

# System tools (Ubuntu/Debian)
sudo apt install nodejs npm python3 ffmpeg
pip3 install yt-dlp
```

## File Structure

```
web/
├── public/          Frontend (HTML/CSS/JS)
├── routes/          API endpoints
├── utils/           Helper functions
├── server.js        Express setup
└── package.json     Dependencies
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| POST | `/api/info` | Get video info |
| POST | `/api/download/start` | Start download |
| GET | `/api/download/status/:id` | Check progress |
| GET | `/api/download/file/:id` | Download file |
| DELETE | `/api/download/:id` | Cancel download |

## Frontend Functions

```javascript
handleFetchInfo()           // Get video metadata
handleStartDownload()       // Begin download
pollDownloadStatus()        // Check progress
resetUI()                   // Clear form
toggleTheme()               // Dark/light mode
```

## Environment Variables

```env
PORT=3000
NODE_ENV=production
MAX_FILE_SIZE_MB=1000
```

## Common Commands

```bash
# Check if yt-dlp installed
yt-dlp --version

# Check if ffmpeg installed
ffmpeg -version

# Check Node version
node --version

# Check npm version
npm --version

# Test health endpoint
curl http://localhost:3000/api/health

# Get video info
curl -X POST http://localhost:3000/api/info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `PORT=3001 npm start` |
| yt-dlp missing | `pip install yt-dlp` |
| FFmpeg missing | `brew install ffmpeg` |
| Node not found | Install from nodejs.org |
| CORS error | Check server.js CORS setup |
| Memory error | `NODE_OPTIONS=--max-old-space-size=1024 npm start` |

## Project Stats

- **Frontend size**: ~45KB
- **Dependencies**: 4 (express, cors, dotenv, uuid)
- **Lines of code**: ~1000
- **API endpoints**: 6
- **Deployment options**: 5+

## Key Features

✅ Download MP4 video
✅ Extract MP3 audio
✅ Multiple quality options
✅ Progress tracking
✅ Dark mode
✅ Mobile responsive
✅ No installation needed
✅ Privacy-focused

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set proper `PORT`
- [ ] Ensure yt-dlp installed
- [ ] Ensure FFmpeg installed
- [ ] Test `/api/health` endpoint
- [ ] Set up SSL/HTTPS
- [ ] Configure rate limiting
- [ ] Monitor disk space
- [ ] Enable logging
- [ ] Set up backups

## Directory Sizes (Approximate)

| Directory | Size |
|-----------|------|
| node_modules | ~150-200MB |
| web/ | <1MB |
| public/ | <50KB |

## Performance Optimization Tips

1. **Reduce concurrent downloads** → Update maxConcurrent in mediaProcessor.js
2. **Limit file size** → Set MAX_FILE_SIZE_MB
3. **Clean temps faster** → Lower TEMP_FILE_CLEANUP_DELAY
4. **Enable compression** → Check gzip in server.js
5. **Monitor memory** → Use Node inspector

## Testing Checklist

- [ ] Fetch video info works
- [ ] Download MP4 completes
- [ ] Extract MP3 completes
- [ ] Progress updates in real-time
- [ ] Cancel download works
- [ ] Temp files cleanup
- [ ] Mobile UI responsive
- [ ] Dark mode toggles
- [ ] Error messages display
- [ ] No memory leaks

## Deployment Platforms

| Platform | Free | Command |
|----------|------|---------|
| Replit | ✅ | Just upload |
| Fly.io | ✅ | `fly deploy` |
| Railway | ✅ | Connect GitHub |
| Heroku | ❌ | `git push` |
| DigitalOcean | ✅ | Docker |

## File Size Limits (Typical)

| Platform | Max Size |
|----------|----------|
| Replit | Depends on storage |
| Fly.io | Depends on plan |
| Railway | Depends on plan |
| Browser | Depends on RAM |

## Important Notes

⚠️ **Free hosting:**
- May have rate limits
- Temp files cleaned automatically
- One download at a time
- Requires internet

✅ **Best practices:**
- Keep dependencies updated
- Monitor system resources
- Regular backups
- Check logs regularly
- Update yt-dlp often

## Quick Links

- Main: [README.md](README.md)
- Setup: [INSTALLATION.md](INSTALLATION.md)
- Deploy: [DEPLOYMENT.md](DEPLOYMENT.md)
- Design: [ARCHITECTURE.md](ARCHITECTURE.md)
- Migrate: [MIGRATION.md](MIGRATION.md)

## Support

- Logs: `npm start` output
- Errors: Check browser console + server logs
- Issues: Check documentation first
- Updates: `npm update`, `pip install -U yt-dlp`

---

**Last Updated**: 2024
**Version**: 1.0
