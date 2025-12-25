// Configuration
const API_BASE_URL = (() => {
  // If running on Vercel frontend, use environment variable
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.API_URL || '/api'; // Set via script tag or env
  }
  // Local development
  return '/api';
})();

let currentDownloadId = null;
let selectedFormat = 'mp4';
let selectedQuality = null;
let videoInfo = null;
let pollInterval = null;

// DOM Elements
const urlInput = document.getElementById('urlInput');
const fetchInfoBtn = document.getElementById('fetchInfoBtn');
const clearBtn = document.getElementById('clearBtn');
const loadingInfo = document.getElementById('loadingInfo');
const errorMsg = document.getElementById('errorMsg');
const infoSection = document.getElementById('infoSection');
const formatSection = document.getElementById('formatSection');
const progressSection = document.getElementById('progressSection');
const completeSection = document.getElementById('completeSection');
const themeToggle = document.getElementById('themeToggle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
});

function initializeTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

function setupEventListeners() {
    fetchInfoBtn.addEventListener('click', handleFetchInfo);
    clearBtn.addEventListener('click', handleClear);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Format tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleFormatChange(e.target.dataset.format));
    });
    
    // Download button
    document.getElementById('downloadBtn').addEventListener('click', handleStartDownload);
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', handleCancelDownload);
    
    // New download buttons
    document.getElementById('newDownloadBtn').addEventListener('click', resetUI);
    document.getElementById('newDownload2Btn').addEventListener('click', resetUI);
    
    // URL input - fetch on Enter
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleFetchInfo();
    });
}

function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    setTimeout(() => {
        if (errorMsg.textContent === message) {
            errorMsg.classList.add('hidden');
        }
    }, 5000);
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
}

async function handleFetchInfo() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter a video URL');
        return;
    }
    
    loadingInfo.classList.remove('hidden');
    errorMsg.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}/info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to fetch video info');
        }
        
        videoInfo = await response.json();
        displayVideoInfo();
        displayFormatOptions();
        
        infoSection.classList.remove('hidden');
        formatSection.classList.remove('hidden');
        loadingInfo.classList.add('hidden');
        
    } catch (error) {
        loadingInfo.classList.add('hidden');
        showError(error.message || 'Failed to fetch video information');
    }
}

function displayVideoInfo() {
    document.getElementById('videoTitle').textContent = videoInfo.title;
    document.getElementById('videoUploader').textContent = videoInfo.uploader;
    document.getElementById('videoDuration').textContent = formatDuration(videoInfo.duration);
    
    if (videoInfo.thumbnail) {
        document.getElementById('thumbnail').src = videoInfo.thumbnail;
    }
}

function displayFormatOptions() {
    // Video formats
    const videoList = document.getElementById('videoQualityList');
    videoList.innerHTML = '';
    
    videoInfo.formats.video.forEach(fmt => {
        const btn = document.createElement('button');
        btn.className = 'quality-btn';
        btn.textContent = `${fmt.quality} • ${fmt.fps}fps`;
        btn.dataset.quality = fmt.quality;
        btn.dataset.formatId = fmt.formatId;
        
        btn.addEventListener('click', () => selectQuality(btn, 'mp4'));
        videoList.appendChild(btn);
    });
    
    // Audio formats
    const audioList = document.getElementById('audioQualityList');
    audioList.innerHTML = '';
    
    videoInfo.formats.audio.forEach(fmt => {
        const btn = document.createElement('button');
        btn.className = 'quality-btn';
        btn.textContent = `${fmt.bitrate}`;
        btn.dataset.quality = fmt.bitrate;
        btn.dataset.formatId = fmt.formatId;
        
        btn.addEventListener('click', () => selectQuality(btn, 'mp3'));
        audioList.appendChild(btn);
    });
    
    // Select first quality by default
    const firstBtn = videoList.querySelector('.quality-btn') || audioList.querySelector('.quality-btn');
    if (firstBtn) {
        selectQuality(firstBtn, selectedFormat);
    }
}

function selectQuality(btn, format) {
    const list = format === 'mp4' 
        ? document.getElementById('videoQualityList')
        : document.getElementById('audioQualityList');
    
    list.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedQuality = btn.dataset.quality;
}

function handleFormatChange(format) {
    selectedFormat = format;
    
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.format === format);
    });
    
    // Update format options visibility
    document.getElementById('videoOptions').classList.toggle('hidden', format !== 'mp4');
    document.getElementById('audioOptions').classList.toggle('hidden', format !== 'mp3');
    
    // Re-select quality for new format
    const qualityBtns = format === 'mp4'
        ? document.getElementById('videoQualityList').querySelectorAll('.quality-btn')
        : document.getElementById('audioQualityList').querySelectorAll('.quality-btn');
    
    if (qualityBtns.length > 0) {
        selectQuality(qualityBtns[0], format);
    }
}

async function handleStartDownload() {
    if (!videoInfo || !selectedQuality) {
        showError('Please select a video and quality');
        return;
    }
    
    const url = urlInput.value.trim();
    
    try {
        const response = await fetch(`${API_BASE_URL}/download/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url,
                format: selectedFormat,
                quality: selectedQuality
            })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to start download');
        }
        
        const data = await response.json();
        currentDownloadId = data.downloadId;
        
        // Hide other sections, show progress
        infoSection.classList.add('hidden');
        formatSection.classList.add('hidden');
        progressSection.classList.remove('hidden');
        completeSection.classList.add('hidden');
        
        // Start polling for status
        pollDownloadStatus();
        pollInterval = setInterval(pollDownloadStatus, 1000);
        
    } catch (error) {
        showError(error.message || 'Failed to start download');
    }
}

async function pollDownloadStatus() {
    if (!currentDownloadId) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/download/status/${currentDownloadId}`);
        const data = await response.json();
        
        // Update progress bar
        const progress = Math.min(data.progress, 100);
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `${Math.round(progress)}%`;
        
        // Update status message
        const statusMap = {
            'starting': '⏳ Starting download...',
            'downloading': '📥 Downloading...',
            'processing': '⚙️ Processing video...',
            'completed': '✅ Download complete!',
            'error': '❌ Error occurred'
        };
        
        const statusMsg = document.getElementById('downloadStatus');
        statusMsg.textContent = statusMap[data.status] || data.status;
        
        if (data.status === 'completed') {
            clearInterval(pollInterval);
            showDownloadComplete();
        } else if (data.status === 'error') {
            clearInterval(pollInterval);
            showError(data.error || 'Download failed');
            document.getElementById('cancelBtn').style.display = 'none';
            document.getElementById('newDownloadBtn').style.display = 'inline-block';
        }
    } catch (error) {
        console.error('Error polling status:', error);
    }
}

function showDownloadComplete() {
    progressSection.classList.add('hidden');
    completeSection.classList.remove('hidden');
    
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = `${API_BASE_URL}/download/file/${currentDownloadId}`;
    downloadLink.download = `download.${selectedFormat}`;
    
    const msg = document.getElementById('completionMessage');
    msg.textContent = `Your ${selectedFormat.toUpperCase()} file is ready! Click the button below to download.`;
}

async function handleCancelDownload() {
    if (!currentDownloadId) return;
    
    clearInterval(pollInterval);
    
    try {
        await fetch(`${API_BASE_URL}/download/${currentDownloadId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error cancelling download:', error);
    }
    
    resetUI();
}

function handleClear() {
    resetUI();
}

function resetUI() {
    urlInput.value = '';
    selectedQuality = null;
    selectedFormat = 'mp4';
    currentDownloadId = null;
    videoInfo = null;
    
    if (pollInterval) {
        clearInterval(pollInterval);
    }
    
    // Clear error messages
    errorMsg.classList.add('hidden');
    
    // Hide all sections except input
    infoSection.classList.add('hidden');
    formatSection.classList.add('hidden');
    progressSection.classList.add('hidden');
    completeSection.classList.add('hidden');
    loadingInfo.classList.add('hidden');
    
    // Reset progress bar
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressText').textContent = '0%';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    document.getElementById('newDownloadBtn').style.display = 'none';
    
    // Focus on input
    urlInput.focus();
}
