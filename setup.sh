#!/bin/bash

# Quick Start Guide for Email Marketing Campaign API

echo "==================================="
echo "Email Marketing Campaign API Setup"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating one..."
    cat > .env << EOF
# Email Configuration
EMAIL_USER=info@filtriva.com
EMAIL_PASS=your_mailbox_password_here

# Server Configuration
PORT=3000
NODE_ENV=development
EOF
    echo "✅ .env file created. Please update it with your credentials."
    echo ""
    echo "📝 Steps to set up SMTP credentials:"
    echo "1. Use your Hostinger mailbox username/password"
    echo "2. Update EMAIL_USER and EMAIL_PASS in .env"
    echo ""
else
    echo "✅ .env file already exists"
fi

echo ""
echo "==================================="
echo "Setup Complete!"
echo "==================================="
echo ""
echo "To start the server in development mode:"
echo "  npm run dev"
echo ""
echo "To start the server in production mode:"
echo "  npm start"
echo ""
echo "Server will be available at: http://localhost:3000"
echo ""
