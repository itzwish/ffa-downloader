@echo off
REM YTDownloader Web - Quick Setup Script for Windows
REM This script sets up and runs the web application

setlocal enabledelayedexpansion

echo.
echo YTDownloader Web Setup
echo ======================
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo Error: Node.js not found
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo OK: Node.js %NODE_VERSION% found

REM Check Python
where python >nul 2>nul
if errorlevel 1 (
    echo Warning: Python 3 not found
    echo Required for yt-dlp
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo OK: Python %PYTHON_VERSION% found

REM Check FFmpeg
where ffmpeg >nul 2>nul
if errorlevel 1 (
    echo Warning: FFmpeg not found
    echo Please install from https://ffmpeg.org/download.html
    echo And add to PATH
    pause
    exit /b 1
)
echo OK: FFmpeg found

REM Check yt-dlp
where yt-dlp >nul 2>nul
if errorlevel 1 (
    echo Info: Installing yt-dlp...
    pip install yt-dlp
)
echo OK: yt-dlp found

REM Navigate to web directory
cd /d "%~dp0"

REM Install dependencies
echo.
echo Installing Node dependencies...
call npm install

REM Create .env if it doesn't exist
if not exist ".env" (
    echo Info: Creating .env file...
    copy .env.example .env
)

REM Get port from argument or use default
set PORT=3000
if not "%1"=="" set PORT=%1

REM Start server
echo.
echo Starting server on http://localhost:%PORT%
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

set PORT=%PORT%
call npm start

pause
