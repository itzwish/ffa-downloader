import os from 'os';
import { existsSync, statSync, rmSync } from 'fs';
import path from 'path';

/**
 * Utility functions for optimization and monitoring
 */

/**
 * Get system resource information
 */
export function getSystemInfo() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: `${Math.round(totalMem / 1024 / 1024 / 1024)}GB`,
    freeMemory: `${Math.round(freeMem / 1024 / 1024)}MB`,
    usedMemory: `${Math.round(usedMem / 1024 / 1024)}MB`,
    memoryUsagePercent: ((usedMem / totalMem) * 100).toFixed(2),
    uptime: `${Math.round(os.uptime() / 60)}m`,
    loadAverage: os.loadavg()
  };
}

/**
 * Get disk usage for temp directory
 */
export function getTempDirUsage(tempDir) {
  if (!existsSync(tempDir)) return 0;
  
  let size = 0;
  const files = require('fs').readdirSync(tempDir);
  
  files.forEach(file => {
    try {
      const filePath = path.join(tempDir, file);
      const stats = statSync(filePath);
      size += stats.size;
    } catch (e) {
      // Ignore errors for individual files
    }
  });
  
  return size;
}

/**
 * Format bytes to readable format
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Check if system has required tools
 */
export function checkRequiredTools() {
  const { execSync } = require('child_process');
  const tools = {
    'node': 'node --version',
    'npm': 'npm --version',
    'ffmpeg': 'ffmpeg -version',
    'yt-dlp': 'yt-dlp --version'
  };
  
  const results = {};
  
  Object.entries(tools).forEach(([tool, command]) => {
    try {
      const output = execSync(command, { encoding: 'utf-8' }).split('\n')[0];
      results[tool] = { status: 'installed', version: output };
    } catch (e) {
      results[tool] = { status: 'missing', version: null };
    }
  });
  
  return results;
}

/**
 * Clean up old files aggressively
 */
export function cleanupTempDir(tempDir, maxAge = 15 * 60 * 1000) {
  if (!existsSync(tempDir)) return 0;
  
  const now = Date.now();
  const files = require('fs').readdirSync(tempDir);
  let cleaned = 0;
  
  files.forEach(file => {
    const filePath = path.join(tempDir, file);
    try {
      const stats = statSync(filePath);
      if (now - stats.mtimeMs > maxAge) {
        rmSync(filePath, { force: true });
        cleaned++;
      }
    } catch (e) {
      console.warn(`Could not clean ${file}:`, e.message);
    }
  });
  
  return cleaned;
}

/**
 * Validate and sanitize URL input
 */
export function sanitizeUrl(url) {
  try {
    // Remove whitespace
    url = url.trim();
    
    // Validate URL format
    new URL(url);
    
    // Check if it's a supported domain
    const supportedDomains = [
      'youtube.com',
      'youtu.be',
      'instagram.com',
      'tiktok.com',
      'twitch.tv',
      'vimeo.com',
      'dailymotion.com'
    ];
    
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    
    const isSupported = supportedDomains.some(domain => hostname.includes(domain));
    
    return {
      valid: isSupported,
      url: url,
      hostname: hostname
    };
  } catch (e) {
    return {
      valid: false,
      url: url,
      error: 'Invalid URL format'
    };
  }
}

/**
 * Rate limiting middleware generator
 */
export function createRateLimiter(maxRequests = 50, windowMs = 15 * 60 * 1000) {
  const requests = new Map();
  
  // Clean old entries every hour
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of requests.entries()) {
      if (now - data.resetTime > windowMs) {
        requests.delete(key);
      }
    }
  }, 60 * 60 * 1000);
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, { count: 0, resetTime: now });
    }
    
    const data = requests.get(ip);
    
    if (now - data.resetTime > windowMs) {
      data.count = 0;
      data.resetTime = now;
    }
    
    data.count++;
    
    res.set('X-RateLimit-Limit', maxRequests);
    res.set('X-RateLimit-Remaining', Math.max(0, maxRequests - data.count));
    
    if (data.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((data.resetTime - now + windowMs) / 1000)
      });
    }
    
    next();
  };
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      totalDownloads: 0,
      totalErrors: 0,
      averageDownloadTime: 0,
      averageFileSize: 0,
      peakMemory: 0,
      startTime: Date.now()
    };
  }
  
  recordDownload(timeMs, sizeBytes) {
    this.metrics.totalDownloads++;
    
    // Update average time
    this.metrics.averageDownloadTime = 
      (this.metrics.averageDownloadTime * (this.metrics.totalDownloads - 1) + timeMs) / 
      this.metrics.totalDownloads;
    
    // Update average size
    this.metrics.averageFileSize = 
      (this.metrics.averageFileSize * (this.metrics.totalDownloads - 1) + sizeBytes) / 
      this.metrics.totalDownloads;
  }
  
  recordError() {
    this.metrics.totalErrors++;
  }
  
  updatePeakMemory(memBytes) {
    if (memBytes > this.metrics.peakMemory) {
      this.metrics.peakMemory = memBytes;
    }
  }
  
  getMetrics() {
    const uptime = Date.now() - this.metrics.startTime;
    
    return {
      ...this.metrics,
      uptime: `${Math.round(uptime / 1000)}s`,
      errorRate: ((this.metrics.totalErrors / this.metrics.totalDownloads) * 100 || 0).toFixed(2),
      averageDownloadTime: `${this.metrics.averageDownloadTime.toFixed(2)}ms`,
      averageFileSize: formatBytes(this.metrics.averageFileSize),
      peakMemory: formatBytes(this.metrics.peakMemory)
    };
  }
}

export default {
  getSystemInfo,
  getTempDirUsage,
  formatBytes,
  checkRequiredTools,
  cleanupTempDir,
  sanitizeUrl,
  createRateLimiter,
  PerformanceMonitor
};
