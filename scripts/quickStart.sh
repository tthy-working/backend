#!/bin/bash

# Quick Start Script for Professor Search Backend
# This script helps you set up the backend quickly

echo "🚀 Professor Search Backend - Quick Start"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your Supabase credentials."
    echo ""
    echo "Copy this template and fill in your values:"
    echo ""
    echo "PORT=5000"
    echo "NODE_ENV=development"
    echo "SUPABASE_URL=your_supabase_url"
    echo "SUPABASE_ANON_KEY=your_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    echo "OPENAI_API_KEY=your_openai_key"
    echo ""
    exit 1
fi

echo "✅ .env file found"
echo ""

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Dependencies installed"
echo ""

# Ask if user wants to seed data
echo "Do you want to populate the database with fake professor data? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🌱 Seeding database with fake data..."
    node database/seedData.js
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure you ran database/schema.sql in Supabase SQL Editor"
echo "2. Start the server: npm run dev"
echo "3. Test the API: curl http://localhost:5000/health"
echo ""
