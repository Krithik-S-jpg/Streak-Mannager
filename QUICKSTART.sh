#!/bin/bash
# Quick Start Script for Streak Maintainer

echo "🔥 Streak Maintainer - Quick Start"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  No .env file found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  Please edit .env with your Firebase credentials:"
    echo "   1. Go to https://console.firebase.google.com"
    echo "   2. Create a new project or use existing one"
    echo "   3. Copy your project config"
    echo "   4. Paste it in .env"
    echo ""
    echo "After updating .env, run: npm run dev"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Start development server
echo "🚀 Starting development server..."
echo "📍 App will open at http://localhost:5173"
echo ""

npm run dev
