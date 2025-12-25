import { execSync, spawn } from 'child_process';
import { existsSync, unlinkSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));

class MediaProcessor {
  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'ytdownloader');
    this.maxConcurrent = 1;
    this.activeDownloads = 0;
    this.cleanupInterval = null;
    this.ensureTempDir();
    this.startCleanupTimer();
  }

  ensureTempDir() {
    if (!existsSync(this.tempDir)) {
      try {
        execSync(`mkdir -p "${this.tempDir}"`, { shell: true });
      } catch (e) {
        console.warn('Could not create temp directory:', e.message);
      }
    }
  }

  startCleanupTimer() {
    // Clean up old temp files every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldFiles();
    }, 5 * 60 * 1000);
  }

  cleanupOldFiles() {
    try {
      const files = require('fs').readdirSync(this.tempDir);
      const now = Date.now();
      const maxAge = 30 * 60 * 1000; // 30 minutes

      files.forEach(file => {
        const filePath = path.join(this.tempDir, file);
        const stats = statSync(filePath);
        if (now - stats.mtimeMs > maxAge) {
          try {
            unlinkSync(filePath);
          } catch (e) {
            console.warn(`Could not delete old file ${file}`);
          }
        }
      });
    } catch (e) {
      console.warn('Error during cleanup:', e.message);
    }
  }

  /**
   * Get video info using yt-dlp
   * @param {string} url - Video URL
   * @returns {Promise<Object>} Video information
   */
  async getVideoInfo(url) {
    return new Promise((resolve, reject) => {
      try {
        // If an environment variable points to a cookies file, pass it to yt-dlp
        const cookiesPath = process.env.YTDLP_COOKIES_PATH;
        const cookieArg = cookiesPath && existsSync(cookiesPath) ? ` --cookies "${cookiesPath}"` : '';
        const command = `yt-dlp -j --no-warnings${cookieArg} "${url}"`;
        const output = execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
        const info = JSON.parse(output);
        
        resolve({
          title: info.title || 'Unknown',
          duration: info.duration || 0,
          formats: this._parseFormats(info),
          thumbnail: info.thumbnail,
          uploader: info.uploader || 'Unknown'
        });
      } catch (error) {
        reject(new Error(`Failed to get video info: ${error.message}`));
      }
    });
  }

  _parseFormats(info) {
    const formats = {
      video: [],
      audio: []
    };

    if (!info.formats) return formats;

    // Group formats by quality
    const videoFormats = info.formats.filter(f => f.vcodec && f.vcodec !== 'none');
    const audioFormats = info.formats.filter(f => f.acodec && f.acodec !== 'none' && !f.vcodec);

    // Best video formats
    const videoQualities = ['1080', '720', '480', '360', '240'];
    videoQualities.forEach(q => {
      const fmt = videoFormats.find(f => f.height >= parseInt(q));
      if (fmt) {
        formats.video.push({
          quality: `${q}p`,
          formatId: fmt.format_id,
          height: fmt.height,
          fps: fmt.fps || 30
        });
      }
    });

    // Best audio formats
    const audioQualities = ['128', '192', '256', '320'];
    audioQualities.forEach(bitrate => {
      const fmt = audioFormats.find(f => f.abr >= parseInt(bitrate));
      if (fmt) {
        formats.audio.push({
          bitrate: `${bitrate}kbps`,
          formatId: fmt.format_id
        });
      }
    });

    // Deduplicate
    formats.video = Array.from(new Map(formats.video.map(v => [v.quality, v])).values());
    formats.audio = Array.from(new Map(formats.audio.map(a => [a.bitrate, a])).values());

    return formats;
  }

  /**
   * Download media
   * @param {string} url - Video URL
   * @param {string} format - 'mp4' or 'mp3'
   * @param {string} quality - Quality preference
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<string>} Path to downloaded file
   */
  async downloadMedia(url, format, quality, onProgress = () => {}) {
    const tempFile = path.join(this.tempDir, `download_${Date.now()}`);
    
    try {
      // Build yt-dlp command
      let command = `yt-dlp -f best --no-warnings`;

      if (format === 'mp3') {
        command += ` -x --audio-format mp3 --audio-quality 192K -o "${tempFile}.%(ext)s"`;
      } else {
        command += ` -f "best[ext=mp4]" -o "${tempFile}.%(ext)s"`;
      }

      const cookiesPath = process.env.YTDLP_COOKIES_PATH;
      if (cookiesPath && existsSync(cookiesPath)) {
        command += ` --cookies "${cookiesPath}"`;
      }

      command += ` "${url}"`;

      return new Promise((resolve, reject) => {
        // Build spawn args (include cookies if available)
        const spawnArgs = [
          '-f', format === 'mp3' ? 'bestaudio' : 'best[ext=mp4]',
          '--no-warnings',
          format === 'mp3' ? '-x' : '',
          format === 'mp3' ? '--audio-format' : '',
          format === 'mp3' ? 'mp3' : '',
          format === 'mp3' ? '--audio-quality' : '',
          format === 'mp3' ? '192K' : '',
          '-o', `${tempFile}.%(ext)s`,
          url
        ].filter(Boolean);

        if (process.env.YTDLP_COOKIES_PATH && existsSync(process.env.YTDLP_COOKIES_PATH)) {
          spawnArgs.splice(spawnArgs.length - 2, 0, '--cookies', process.env.YTDLP_COOKIES_PATH);
        }

        const child = spawn('yt-dlp', spawnArgs, { shell: false });

        let errorOutput = '';
        // Emit initial progress
        try { onProgress(0); } catch (e) {}

        child.stderr.on('data', (data) => {
          const text = data.toString();
          errorOutput += text;
          // Match integer or decimal percentages like '12%' or '12.3%'
          const match = text.match(/(\d+(?:\.\d+)?)%/);
          if (match) {
            try {
              onProgress(parseFloat(match[1]));
            } catch (e) {}
          }
        });

        child.on('close', (code) => {
          // Ensure we report completion progress
          try { onProgress(100); } catch (e) {}

          if (code === 0) {
            const ext = format === 'mp3' ? 'mp3' : 'mp4';
            const outputFile = `${tempFile}.${ext}`;
            if (existsSync(outputFile)) {
              resolve(outputFile);
            } else {
              reject(new Error('Download completed but file not found'));
            }
          } else {
            reject(new Error(`yt-dlp failed: ${errorOutput}`));
          }
        });
        child.on('error', (err) => {
          reject(new Error(`yt-dlp spawn error: ${err.message}`));
        });
      });
    } catch (error) {
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  /**
   * Convert media with FFmpeg
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {string} quality - Quality setting
   * @returns {Promise<string>} Output path
   */
  async convertWithFFmpeg(inputPath, outputPath, quality = 'medium') {
    return new Promise((resolve, reject) => {
      const args = this._buildFFmpegArgs(inputPath, outputPath, quality);
      
      const ffmpeg = spawn('ffmpeg', args);
      
      ffmpeg.stderr.on('data', (data) => {
        const output = data.toString();
        const match = output.match(/time=(\d+):(\d+):(\d+)/);
        if (match) {
          // Could emit progress here
        }
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(outputPath);
        } else {
          reject(new Error(`FFmpeg conversion failed with code ${code}`));
        }
      });

      ffmpeg.on('error', (error) => {
        reject(new Error(`FFmpeg error: ${error.message}`));
      });
    });
  }

  _buildFFmpegArgs(inputPath, outputPath, quality) {
    const args = ['-i', inputPath, '-y'];
    
    switch (quality) {
      case 'low':
        args.push('-q:v', '28', '-q:a', '5');
        break;
      case 'medium':
        args.push('-q:v', '24', '-q:a', '4');
        break;
      case 'high':
        args.push('-q:v', '18', '-q:a', '2');
        break;
      default:
        args.push('-q:v', '24');
    }
    
    args.push(outputPath);
    return args;
  }

  /**
   * Clean up temporary file
   * @param {string} filePath - File to delete
   */
  cleanup(filePath) {
    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch (error) {
      console.warn(`Could not cleanup ${filePath}:`, error.message);
    }
  }
}

export default new MediaProcessor();
