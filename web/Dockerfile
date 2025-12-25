FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    py3-pip \
    curl

# Install yt-dlp
RUN pip install yt-dlp --break-system-packages

# Copy package files
COPY web/package*.json ./

# Install Node dependencies
RUN npm ci --only=production

# Copy application files
COPY web/public ./public
COPY web/server.js ./
COPY web/routes ./routes
COPY web/utils ./utils

# Create temp directory for downloads
RUN mkdir -p /tmp/ytdownloader

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["node", "server.js"]
