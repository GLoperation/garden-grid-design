#!/bin/bash

# ╔═══════════════════════════════════════════════════╗
# ║         GardenGridDesign - Setup Script           ║
# ║           Mac / Linux / WSL                       ║
# ╚═══════════════════════════════════════════════════╝

echo ""
echo "🌱 GardenGridDesign — Setup"
echo "─────────────────────────────"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found."
    echo "   Install it from: https://nodejs.org (v18+ recommended)"
    echo "   Or use: brew install node (Mac) / sudo apt install nodejs npm (Linux)"
    exit 1
fi

NODE_VER=$(node -v)
echo "✅ Node.js $NODE_VER found"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. It usually comes with Node.js."
    exit 1
fi

echo "✅ npm $(npm -v) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Check errors above."
    exit 1
fi

echo "✅ Dependencies installed"

# Setup .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo ""
    echo "📄 Created .env file from .env.example"
    echo "   ⚠️  To enable the chat assistant, edit .env and add your Anthropic API key."
    echo "   Get one at: https://console.anthropic.com/"
    echo "   (The garden planner works fully without it — chat is optional.)"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "─────────────────────────────"
echo "🎉 Setup complete!"
echo ""
echo "   Start the app:  npm run dev"
echo "   Then open:       http://localhost:3000"
echo ""
echo "   Build for production:  npm run build"
echo "   Preview build:         npm run preview"
echo ""
