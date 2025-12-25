# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                      User's Browser                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             React/Vanilla JS Frontend                │   │
│  │  - Input URL                                         │   │
│  │  - Display formats/quality options                   │   │
│  │  - Show progress                                     │   │
│  │  - Download file                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬──────────────────────────────────────┘
                      │ HTTP/HTTPS
                      │
┌─────────────────────▼──────────────────────────────────────┐
│                   Express Server                            │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │  Routes   │  │ Middleware │  │  Request Handler     │  │
│  │ /api/*    │  │ CORS, Auth │  │ Validation, Logging  │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Media Processor                            │   │
│  │  - yt-dlp wrapper (video info, download)            │   │
│  │  - FFmpeg wrapper (conversion)                       │   │
│  │  - Download queue management                         │   │
│  │  - Progress tracking                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Storage Management                        │   │
│  │  - Temp file creation                               │   │
│  │  - Automatic cleanup                                │   │
│  │  - Download tracking (in-memory Map)                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬──────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    ┌────────┐  ┌────────────┐  ┌──────────┐
    │ yt-dlp │  │  FFmpeg    │  │ /tmp dir │
    │        │  │            │  │ (temp)   │
    └────────┘  └────────────┘  └──────────┘
```

## Component Architecture

### Frontend (web/public/)

**Files:**
- `index.html` - Markup structure
- `app.js` - Business logic and event handling
- `styles.css` - Responsive styling

**Responsibilities:**
- Render UI
- Handle user input validation
- Make API calls
- Poll for download status
- Display progress/errors

**Key Functions:**
```javascript
handleFetchInfo()      // Get video metadata
handleStartDownload()  // Initiate download
pollDownloadStatus()   // Check progress
showDownloadComplete() // Handle completion
```

### Backend (web/)

**Server (server.js)**
- Express setup
- Middleware configuration
- Route mounting
- Error handling

**Routes**
- `routes/download.js` - Download management
  - POST `/start` - Begin download
  - GET `/status/:id` - Check progress
  - GET `/file/:id` - Stream file
  - DELETE `/:id` - Cancel

- `routes/info.js` - Video information
  - POST `/` - Get video details

**Utilities (utils/)**
- `mediaProcessor.js` - Media handling
  - Video info extraction
  - Download management
  - Format/quality parsing
  - File cleanup
  
- `optimization.js` - System optimization
  - Resource monitoring
  - Rate limiting
  - Input validation
  - Cleanup utilities

## Data Flow

### Download Process

```
1. User enters URL
        ↓
2. Frontend → GET /api/info
        ↓
3. Backend: yt-dlp queries URL
        ↓
4. Backend returns formats/quality options
        ↓
5. User selects format and quality
        ↓
6. Frontend → POST /api/download/start
        ↓
7. Backend: Generates downloadId
        ↓
8. Backend: Spawns yt-dlp process
        ↓
9. Frontend: Polls GET /api/download/status/:downloadId
        ↓
10. Backend updates progress (0-100%)
        ↓
11. yt-dlp completes, saves to temp file
        ↓
12. Frontend: Shows completion message
        ↓
13. User clicks download
        ↓
14. Frontend → GET /api/download/file/:downloadId
        ↓
15. Server streams file to browser
        ↓
16. Browser downloads file
        ↓
17. Server cleans up temp file
```

## State Management

### Server-Side State

**In-Memory Map: `activeDownloads`**
```javascript
{
  "uuid-1234": {
    id: "uuid-1234",
    url: "https://...",
    format: "mp4",
    quality: "720p",
    status: "downloading",
    progress: 45.5,
    filePath: "/tmp/ytdownloader/file.mp4",
    error: null,
    createdAt: Date
  }
}
```

**Why not database?**
- Free tier has limited storage
- No persistent history needed (privacy)
- Downloads cleaned up after use
- Simpler deployment

### Client-Side State

**Variables:**
```javascript
currentDownloadId   // UUID of active download
selectedFormat      // "mp4" or "mp3"
selectedQuality     // User's choice
videoInfo           // Cached video metadata
pollInterval        // Timer for status polling
```

**Browser Storage:**
```javascript
localStorage.theme      // "dark" or "light"
localStorage.language   // Language preference
```

## API Contract

### Request/Response Pattern

**Health Check**
```
GET /api/health
Response: 200
{
  "status": "ok",
  "timestamp": "ISO-8601"
}
```

**Get Video Info**
```
POST /api/info
Body: { "url": "string" }

Response: 200
{
  "title": "string",
  "duration": number (seconds),
  "uploader": "string",
  "thumbnail": "url",
  "formats": {
    "video": [
      {
        "quality": "1080p",
        "formatId": "string",
        "height": number,
        "fps": number
      }
    ],
    "audio": [
      {
        "bitrate": "192kbps",
        "formatId": "string"
      }
    ]
  }
}

Error: 400
{
  "error": "string message"
}
```

**Start Download**
```
POST /api/download/start
Body: {
  "url": "string",
  "format": "mp4" | "mp3",
  "quality": "string"
}

Response: 200
{
  "downloadId": "uuid",
  "message": "Download started"
}

Error: 400
{
  "error": "string message"
}
```

**Get Status**
```
GET /api/download/status/:downloadId

Response: 200
{
  "id": "uuid",
  "status": "starting" | "downloading" | "processing" | "completed" | "error",
  "progress": 0-100,
  "format": "mp4" | "mp3",
  "error": null | "error message"
}
```

**Download File**
```
GET /api/download/file/:downloadId

Response: 200 (binary stream)
Header: Content-Disposition: attachment; filename="download.mp4"
Header: Content-Type: video/mp4 | audio/mpeg

Error: 404
{
  "error": "Download not found"
}
```

**Cancel Download**
```
DELETE /api/download/:downloadId

Response: 200
{
  "message": "Download cancelled and cleaned up"
}
```

## Error Handling

### Frontend

```javascript
try {
  const response = await fetch(url);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
} catch (error) {
  showError(error.message);
}
```

### Backend

```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message,
    message: isDev ? err.stack : undefined
  });
});
```

### Common Errors

| Scenario | Status | Response |
|----------|--------|----------|
| Invalid URL | 400 | `{ error: "Invalid URL" }` |
| yt-dlp fails | 400 | `{ error: "Video not available" }` |
| File not found | 404 | `{ error: "Download not found" }` |
| Server error | 500 | `{ error: "Internal server error" }` |
| Rate limited | 429 | `{ error: "Too many requests" }` |

## Performance Optimizations

### Frontend
- **Lazy load**: No framework overhead
- **Minimal CSS**: ~8KB gzipped
- **Efficient polling**: 1-second intervals
- **Local caching**: Video info not refetched

### Backend
- **Streaming**: No buffering large files
- **Process pooling**: Single yt-dlp/ffmpeg at a time
- **Temp cleanup**: Auto-delete after 30 mins
- **In-memory state**: Fast lookups, no disk I/O

### System
- **Compression**: gzip enabled
- **CORS**: Only necessary headers
- **Caching**: Leverage browser cache for static assets
- **Rate limiting**: Prevent abuse

## Scalability

### Current (Single Server)
- ~10-20 concurrent users
- 1-5 downloads/second
- ~50-100MB memory

### Scaled (Multiple Servers)
Would need:
- Load balancer (nginx/HAProxy)
- Shared queue (Redis)
- Distributed caching
- Session management
- File storage (S3/GCS)

### Cost per Tier
| Users | Storage | CPU | RAM | Cost |
|-------|---------|-----|-----|------|
| <10 | 1GB | Shared | 512MB | $0-5/mo |
| <100 | 10GB | 1 core | 1GB | $5-10/mo |
| <1000 | 100GB | 2 cores | 2GB | $20-50/mo |

## Security

### Input Validation
```javascript
// URL sanitization
new URL(url); // Throws if invalid
// Domain whitelist
const supportedDomains = ['youtube.com', ...];
```

### API Protection
```javascript
// CORS: Allow only necessary origins
app.use(cors());

// Rate limiting: Prevent DoS
createRateLimiter(50 requests/15 min);

// File cleanup: No storage buildup
setTimeout(() => cleanup(file), 5000);
```

### Process Isolation
```javascript
// Each download spawns separate process
spawn('yt-dlp', args);
// Errors contained to individual request
```

## Deployment

### Local
```bash
npm install
npm start
# Server: http://localhost:3000
```

### Docker
```bash
docker-compose up
# Server: http://localhost:3000
```

### Cloud (Fly.io example)
```bash
fly deploy
# Server: https://app.fly.dev
```

## Monitoring & Debugging

### Health Endpoint
```bash
curl http://localhost:3000/api/health
```

### Logs
```bash
# Docker
docker-compose logs -f app

# Terminal
npm start 2>&1 | tee app.log
```

### Metrics (optional)
```javascript
import { PerformanceMonitor } from './utils/optimization.js';
const monitor = new PerformanceMonitor();
```

---

**Diagram created**: 2024
**Last updated**: [Current Date]
