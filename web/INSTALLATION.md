# Installation & Setup Guide

## Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **Python**: 3.7 or higher (for yt-dlp)
- **FFmpeg**: 4.0 or higher
- **Disk Space**: At least 1GB free (for temp downloads)
- **RAM**: 512MB minimum (1GB recommended)

### Operating System Support
- ✅ macOS (10.13+)
- ✅ Linux (Ubuntu 18.04+, Debian 10+)
- ✅ Windows (10+)

## Installation Steps

### 1. Install Node.js

**macOS:**
```bash
brew install node
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nodejs npm
```

**Windows:**
Download from https://nodejs.org/ or use:
```powershell
choco install nodejs
```

**Verify installation:**
```bash
node --version
npm --version
```

### 2. Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt install ffmpeg
```

**Windows:**
```powershell
choco install ffmpeg
# OR download from https://ffmpeg.org/download.html
```

**Verify installation:**
```bash
ffmpeg -version
```

### 3. Install yt-dlp

**macOS/Linux:**
```bash
pip install yt-dlp
# or with pip3
pip3 install yt-dlp
```

**Windows:**
```powershell
pip install yt-dlp
```

**Or use npm (any platform):**
```bash
npm install -g yt-dlp
```

**Verify installation:**
```bash
yt-dlp --version
```

### 4. Clone/Setup the Web Application

```bash
# Navigate to your ytDownloader project
cd ~/path/to/ytDownloader-main

# Enter the web directory
cd web

# Install Node dependencies
npm install
```

### 5. Start the Server

**Development Mode:**
```bash
npm start
# Server starts at http://localhost:3000
```

**With nodemon (auto-reload on file changes):**
```bash
npm run dev
# Note: First run `npm install --save-dev nodemon`
```

### 6. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## Docker Installation

### Using Docker

**Prerequisites:**
- Docker installed (https://docker.com)

**Steps:**
```bash
# Navigate to project
cd ~/path/to/ytDownloader-main

# Build image
docker build -t ytdownloader-web:latest ./web

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  ytdownloader-web:latest
```

### Using Docker Compose

```bash
# From web directory
cd web

# Start services
docker-compose up

# Access at http://localhost:3000

# Stop services
docker-compose down
```

## Cloud Platform Installation

### Replit

1. Go to https://replit.com
2. Create new Replit project or import from GitHub
3. Create `.replit` file with:
   ```
   modules = ["nodejs-20", "python310"]
   run = "cd web && npm install && npm start"
   ```
4. Click "Run"

### Fly.io

```bash
# Install Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/

# Login
fly auth login

# Launch
cd web
fly launch

# Deploy
fly deploy

# View logs
fly logs
```

### Railway

1. Go to https://railway.app
2. Connect GitHub repository
3. Railway auto-detects Node.js
4. Set environment variables in dashboard:
   - `PORT=3000`
   - `NODE_ENV=production`
5. Deploy on commit

### Heroku (older approach)

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

heroku login
heroku create ytdownloader-web
cd web
git push heroku main
```

## Troubleshooting

### Port Already in Use
```bash
# Change port
PORT=3001 npm start

# Or kill process using port 3000
# macOS/Linux:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### yt-dlp Not Found

```bash
# Update Python
python --version  # Should be 3.7+

# Reinstall yt-dlp
pip install -U yt-dlp

# Check installation
which yt-dlp
yt-dlp --version
```

### FFmpeg Not Found

**macOS:**
```bash
brew install ffmpeg
which ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
which ffmpeg
```

**Windows:**
```powershell
# Add FFmpeg to PATH
# Or reinstall: choco install ffmpeg --force
```

### Module Not Found Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Permission Denied on macOS/Linux

```bash
# Fix permissions
sudo chown -R $USER ~/.npm
npm install
```

### Out of Memory

```bash
# Increase Node memory limit
NODE_OPTIONS=--max-old-space-size=1024 npm start
```

### Video Information Won't Load

```bash
# Update yt-dlp
pip install -U yt-dlp

# Check cookie issues (YouTube)
# Add cookies: echo "ytdownloader.json" > cookies.txt
# Then update code to use cookies
```

## Configuration

### Environment Variables

Create a `.env` file in the `web/` directory:

```env
# Server
PORT=3000
NODE_ENV=production

# Optional limits
MAX_FILE_SIZE_MB=1000
RATE_LIMIT_MAX_REQUESTS=50
```

### System Limits (Production)

**For Fly.io/Railway:**
```toml
# fly.toml
[resources]
  memory_mb = 512
  cpu_kind = "shared"
  cpu_cores = 1
```

## Performance Optimization

### For Free Hosting Tiers

1. **Reduce Concurrent Downloads**: Set `maxConcurrent = 1` in mediaProcessor.js
2. **Limit File Size**: Add MAX_FILE_SIZE_MB check
3. **Auto-cleanup**: Temp files deleted every 30 minutes
4. **Memory Limit**: Set via NODE_OPTIONS

### Recommended Specs by Scale

**Small (< 10 users/day):**
- 512MB RAM
- Shared CPU
- 1GB storage

**Medium (10-100 users/day):**
- 1GB RAM
- 1 CPU core
- 5GB storage

**Large (100+ users/day):**
- 2+ GB RAM
- 2+ CPU cores
- 20GB storage with Redis

## Development Workflow

### Setup Development Environment

```bash
# Install dev dependencies
npm install --save-dev nodemon

# Create development config
cp .env.example .env

# Start in development mode
npm run dev
```

### Testing Locally

```bash
# Test API health
curl http://localhost:3000/api/health

# Test video info (replace URL)
curl -X POST http://localhost:3000/api/info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=..."}'

# Monitor logs
tail -f logs/app.log
```

## Backup & Recovery

### Backup Configuration

```bash
# Backup important files
cp web/server.js server.js.backup
cp web/package.json package.json.backup
cp .env .env.backup
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Restart server
npm start
```

## Security Checklist

- [ ] Change default PORT if needed
- [ ] Set NODE_ENV=production
- [ ] Review CORS settings
- [ ] Validate URL inputs
- [ ] Monitor temp file cleanup
- [ ] Set rate limits
- [ ] Use HTTPS in production
- [ ] Keep yt-dlp updated
- [ ] Monitor resource usage

## Support & Help

- Check logs: `npm start` (shows errors)
- Update tools: `pip install -U yt-dlp` + `brew upgrade ffmpeg`
- Test connectivity: `curl https://www.youtube.com`
- Check Node version: `node --version`

---

**Still having issues?** Check the main README.md or create an issue on GitHub.
