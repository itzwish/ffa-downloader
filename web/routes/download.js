import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, unlinkSync } from 'fs';
import path from 'path';
import mediaProcessor from '../utils/mediaProcessor.js';

const router = express.Router();

// In-memory store for active downloads (in production, use Redis)
const activeDownloads = new Map();

/**
 * POST /api/download/start
 * Start a download
 */
router.post('/start', async (req, res) => {
  const { url, format, quality } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!['mp4', 'mp3'].includes(format)) {
    return res.status(400).json({ error: 'Format must be mp4 or mp3' });
  }

  const downloadId = uuidv4();
  const download = {
    id: downloadId,
    url,
    format,
    quality: quality || 'medium',
    status: 'starting',
    progress: 0,
    filePath: null,
    error: null,
    createdAt: new Date()
  };

  activeDownloads.set(downloadId, download);

  // Start download in background
  mediaProcessor.downloadMedia(url, format, quality, (progress) => {
    const dl = activeDownloads.get(downloadId);
    if (dl) dl.progress = progress;
  })
    .then((filePath) => {
      const dl = activeDownloads.get(downloadId);
      if (dl) {
        dl.filePath = filePath;
        dl.status = 'completed';
        dl.progress = 100;
      }
    })
    .catch((error) => {
      const dl = activeDownloads.get(downloadId);
      if (dl) {
        dl.status = 'error';
        dl.error = error.message;
      }
    });

  res.json({ 
    downloadId,
    message: 'Download started'
  });
});

/**
 * GET /api/download/status/:downloadId
 * Get download status
 */
router.get('/status/:downloadId', (req, res) => {
  const { downloadId } = req.params;
  const download = activeDownloads.get(downloadId);

  if (!download) {
    return res.status(404).json({ error: 'Download not found' });
  }

  res.json({
    id: download.id,
    status: download.status,
    progress: download.progress,
    format: download.format,
    error: download.error
  });
});

/**
 * GET /api/download/file/:downloadId
 * Get the downloaded file
 */
router.get('/file/:downloadId', (req, res) => {
  const { downloadId } = req.params;
  const download = activeDownloads.get(downloadId);

  if (!download) {
    return res.status(404).json({ error: 'Download not found' });
  }

  if (download.status !== 'completed' || !download.filePath) {
    return res.status(400).json({ error: 'Download not ready' });
  }

  if (!existsSync(download.filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const fileName = `download.${download.format}`;
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', download.format === 'mp4' ? 'video/mp4' : 'audio/mpeg');
  
  res.download(download.filePath, fileName, (err) => {
    if (err) console.error('Download error:', err);
    // Clean up after sending
    setTimeout(() => mediaProcessor.cleanup(download.filePath), 5000);
    activeDownloads.delete(downloadId);
  });
});

/**
 * DELETE /api/download/:downloadId
 * Cancel/cleanup download
 */
router.delete('/:downloadId', (req, res) => {
  const { downloadId } = req.params;
  const download = activeDownloads.get(downloadId);

  if (!download) {
    return res.status(404).json({ error: 'Download not found' });
  }

  if (download.filePath && existsSync(download.filePath)) {
    mediaProcessor.cleanup(download.filePath);
  }

  activeDownloads.delete(downloadId);
  res.json({ message: 'Download cancelled and cleaned up' });
});

export default router;
