#!/bin/bash

echo "============================================"
echo "Zoom Attendance Admin - Setup Script"
echo "============================================"
echo ""

echo "[1/4] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js found: $(node --version)"
echo ""

echo "[2/4] Installing dependencies..."
echo "This may take 2-5 minutes..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi
echo "Dependencies installed successfully!"
echo ""

echo "[3/4] Checking environment configuration..."
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Please edit the .env file and add your Zoom API credentials!"
    echo ""
    echo "You need to:"
    echo "  1. Go to https://marketplace.zoom.us/"
    echo "  2. Create a Server-to-Server OAuth app"
    echo "  3. Copy your credentials to the .env file"
    echo ""
    echo "Opening .env file..."
    
    # Try to open with default editor
    if command -v nano &> /dev/null; then
        nano .env
    elif command -v vim &> /dev/null; then
        vim .env
    elif command -v vi &> /dev/null; then
        vi .env
    else
        echo "Please edit .env manually with your preferred editor"
    fi
else
    echo ".env file already exists"
fi
echo ""

echo "[4/4] Setup complete!"
echo ""
echo "============================================"
echo "Next Steps:"
echo "============================================"
echo "1. Make sure you've added Zoom credentials to .env"
echo "2. Run: npm run dev"
echo "3. Login with: admin / admin123"
echo "4. Change the default password!"
echo ""
echo "============================================"
echo ""

read -p "Would you like to start the application now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting application..."
    npm run dev
else
    echo ""
    echo "Run 'npm run dev' when ready to start!"
fi
