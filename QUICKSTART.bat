@echo off
REM Quick Start Script for Streak Maintainer (Windows)

echo.
echo 🔥 Streak Maintainer - Quick Start (Windows)
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

echo ✅ npm version:
npm --version

echo.
echo 📦 Installing dependencies...
call npm install

REM Check if .env exists
if not exist ".env" (
    echo.
    echo ⚠️  No .env file found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  Please edit .env with your Firebase credentials:
    echo    1. Go to https://console.firebase.google.com
    echo    2. Create a new project or use existing one
    echo    3. Copy your project config
    echo    4. Paste it in .env
    echo.
    echo After updating .env, run: npm run dev
    echo.
    pause
    exit /b 1
)

echo ✅ .env file found
echo.
echo 🚀 Starting development server...
echo 📍 App will open at http://localhost:5173
echo.

call npm run dev
pause
