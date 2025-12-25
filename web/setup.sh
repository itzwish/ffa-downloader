#!/bin/bash

# YTDownloader Web - Quick Setup Script
# This script sets up and runs the web application

set -e

echo "🚀 YTDownloader Web Setup"
echo "========================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "⚠️ Python 3 not found. Required for yt-dlp"
    exit 1
fi
echo "✅ Python $(python3 --version | awk '{print $2}') found"

# Check FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️ FFmpeg not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ffmpeg
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install -y ffmpeg
    fi
fi
echo "✅ FFmpeg found"

# Check yt-dlp
if ! command -v yt-dlp &> /dev/null; then
    echo "ℹ️ Installing yt-dlp..."
    pip install yt-dlp --quiet
fi
echo "✅ yt-dlp found"

# Navigate to web directory
cd "$(dirname "$0")"

# Install dependencies
echo ""
echo "📦 Installing Node dependencies..."
npm install --quiet

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "ℹ️ Creating .env file..."
    cp .env.example .env
fi

# Check available port
PORT=${1:-3000}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️ Port $PORT is already in use"
    echo "Usage: ./setup.sh [PORT]"
    exit 1
fi

# Start server
echo ""
echo "🌐 Starting server on http://localhost:$PORT"
echo "📂 Logs will appear below..."
echo ""
echo "Press Ctrl+C to stop the server"
echo "============================================"
echo ""

PORT=$PORT npm start
