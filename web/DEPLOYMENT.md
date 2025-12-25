# YTDownloader Web - Deployment Configuration

## Replit Deployment

```bash
# .replit
run = "npm install && npm start"
modules = ["nodejs-20"]
```

### Environment Variables
```
PORT=3000
NODE_ENV=production
```

## Fly.io Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY web/package*.json ./

RUN npm ci --only=production && \
    apk add --no-cache ffmpeg && \
    pip install yt-dlp

COPY web/ .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Commands
```bash
fly auth login
fly apps create ytdownloader-web
fly deploy
```

## Railway Deployment

Simple deployment with `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "dockerfile"
  },
  "deploy": {
    "startCommand": "cd web && npm start"
  }
}
```

## Environment Variables Needed

- `PORT`: Server port (default 3000)
- `NODE_ENV`: Development or production

## System Requirements

**Minimum:**
- 512MB RAM
- 1GB storage for temporary files
- Node.js 18+

**Installed Tools:**
- `yt-dlp`: For video/audio extraction
- `ffmpeg`: For media processing
- `node`: JavaScript runtime

## Installation on Hosting Platform

### For Replit:
1. Copy the `web/` folder
2. Create `.replit` file with run command
3. Install: `npm install`
4. Run: `npm start`

### For Fly.io:
1. Install Fly CLI
2. Use provided Dockerfile
3. Deploy with `fly deploy`

### For Railway:
1. Connect GitHub repository
2. Railway auto-detects Node.js
3. Set environment variables in dashboard

## Important Notes

⚠️ **Free Hosting Limitations:**
- Limited concurrent downloads
- Temporary files cleaned automatically
- May need to restart periodically
- Not suitable for high-traffic production

✅ **Optimizations Applied:**
- In-memory download queue
- Automatic temp file cleanup
- Minimal dependencies
- Lightweight UI (< 50KB total)
