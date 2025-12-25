# YTDownloader Web 🎬🎵

A modern, lightweight web application to download videos and audio from YouTube and 1000+ other platforms.

**No installation needed** • Works on any device • Mobile responsive • Free to host

---

## Features

✨ **Download Videos** - MP4 format in multiple qualities (1080p, 720p, 480p, 360p, 240p)
✨ **Extract Audio** - MP3 format in various bitrates (128kbps - 320kbps)
✨ **Instant Download** - No registration or login required
✨ **Multiple Platforms** - Works with YouTube, Instagram, TikTok, Twitch, and 1000+ more
✨ **Real-time Progress** - Track downloads as they happen
✨ **Mobile Friendly** - Fully responsive design
✨ **Dark Mode** - Toggle between light and dark themes
✨ **Privacy First** - No data stored, files cleaned up automatically
✨ **Lightweight** - ~45KB frontend, zero bloat

---

## Quick Start

### Option 1: Run Locally (5 minutes)

```bash
# Install dependencies
npm install

# Start server
npm start

# Open in browser
# http://localhost:3000
```

### Option 2: Deploy to Cloud (10 minutes)

**Split Deployment** (Replit Backend + Vercel Frontend):
- Backend on Replit (Node.js + yt-dlp)
- Frontend on Vercel (Static HTML/CSS/JS)
- See [DEPLOY_SPLIT.md](./DEPLOY_SPLIT.md) for full guide

**Replit** (All-in-one, Recommended for beginners):
1. Upload this repository to Replit
2. Click "Run"
3. Share the URL

**Fly.io**:
```bash
fly deploy
```

**Railway**:
1. Connect your GitHub repository
2. Railway auto-deploys

### Option 3: Docker

```bash
docker-compose up
# http://localhost:3000
```

---

## System Requirements

- **Node.js** 18+
- **Python** 3.7+ (for yt-dlp)
- **FFmpeg** 4.0+

### Install Dependencies

**macOS**:
```bash
brew install node python3 ffmpeg
pip install yt-dlp
```

**Ubuntu/Debian**:
```bash
sudo apt install nodejs npm python3 ffmpeg
pip3 install yt-dlp
```

**Windows**:
- Download Node.js from [nodejs.org](https://nodejs.org)
- Download FFmpeg from [ffmpeg.org](https://ffmpeg.org/download.html)
- Install yt-dlp: `pip install yt-dlp`

---

## API Endpoints

### Get Video Information
```
POST /api/info
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=..."
}

Response:
{
  "title": "Video Title",
  "duration": 180,
  "uploader": "Channel Name",
  "thumbnail": "https://...",
  "formats": {
    "video": [
      { "quality": "1080p", "formatId": "...", "height": 1080, "fps": 30 }
    ],
    "audio": [
      { "bitrate": "192kbps", "formatId": "..." }
    ]
  }
}
```

### Start Download
```
POST /api/download/start
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=...",
  "format": "mp4",
  "quality": "720p"
}

Response:
{
  "downloadId": "uuid",
  "message": "Download started"
}
```

### Check Download Status
```
GET /api/download/status/:downloadId

Response:
{
  "id": "uuid",
  "status": "downloading",
  "progress": 45.5,
  "format": "mp4",
  "error": null
}
```

### Download File
```
GET /api/download/file/:downloadId
```

### Cancel Download
```
DELETE /api/download/:downloadId
```

---

## File Structure

```
.
├── public/
│   ├── index.html       Frontend UI
│   ├── app.js           JavaScript logic
│   └── styles.css       Styling
├── routes/
│   ├── download.js      Download API
│   └── info.js          Info API
├── utils/
│   ├── mediaProcessor.js    yt-dlp & FFmpeg
│   └── optimization.js      System utilities
├── server.js            Express server
├── package.json         Dependencies
├── Dockerfile           Docker setup
├── docker-compose.yml   Docker compose
├── fly.toml            Fly.io config
└── .env.example        Environment template
```

---

## Configuration

### Environment Variables

Create a `.env` file (or copy from `.env.example`):

```env
PORT=3000
NODE_ENV=production
MAX_FILE_SIZE_MB=1000
```

---

## Supported Sites

Via yt-dlp, this app supports:
- YouTube
- Instagram
- TikTok
- Twitch
- Vimeo
- DailyMotion
- And 1000+ more!

---

## Deployment

### Replit (Free, Easiest)
1. Upload repository
2. Click "Run"
3. Done!

### Fly.io (Free tier available)
```bash
fly deploy
```

### Railway (Free tier available)
1. Connect GitHub repo
2. Auto-deploys on push

### Docker (Any VPS)
```bash
docker-compose up
# Or push to your hosting
```

---

## Troubleshooting

### `npm: command not found`
Install Node.js from [nodejs.org](https://nodejs.org)

### `yt-dlp: command not found`
```bash
pip install yt-dlp
```

### `ffmpeg: command not found`
- macOS: `brew install ffmpeg`
- Ubuntu: `sudo apt install ffmpeg`
- Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### Port 3000 already in use
```bash
PORT=3001 npm start
```

### Download fails
Update yt-dlp:
```bash
pip install -U yt-dlp
```

---

## Performance

| Metric | Value |
|--------|-------|
| Frontend Size | ~45KB |
| Page Load | <1s |
| API Response | <500ms |
| Memory Usage | ~50MB |
| Concurrent Downloads | 1-10 (depends on hosting) |

---

## Security

✅ Input validation on all URLs
✅ CORS protection
✅ Automatic temp file cleanup
✅ Safe error messages
✅ No data stored
✅ Process isolation

---

## Development

### Local Development
```bash
npm run dev
# Uses nodemon for auto-restart
```

### Modify the UI
Edit `public/styles.css` for styling
Edit `public/app.js` for functionality
Edit `public/index.html` for structure

### Add Features
Create new routes in `routes/` folder
Add utilities in `utils/` folder
Update API endpoints as needed

---

## License

GPL-3.0 - See LICENSE file

---

## Credits

**Original Creator:** Andrew (@aandrew-me)
**Web Version:** Modern stack with Node.js + Vanilla JS

---

## Support

- **Getting Started:** Check quick start section above
- **Setup Issues:** Install Node.js, Python, and FFmpeg properly
- **Deployment:** Follow the deployment section
- **API Help:** See API Endpoints section

---

Made with ❤️ for simplicity and accessibility

**Version 1.0** | 2024
