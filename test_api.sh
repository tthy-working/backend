#!/bin/bash

echo "🚀 Testing Professor Search API..."
echo "-----------------------------------"

# 1. Health Check (if you have one, otherwise just root)
echo "1️⃣  Testing Root Endpoint..."
curl -s http://localhost:5000/ | grep "API" && echo "✅ Server is running" || echo "❌ Server might be down"
echo ""

# 2. Search Professors (No filters)
echo "2️⃣  Searching all professors..."
curl -s "http://localhost:5000/api/search/professors?limit=2" | grep "success" && echo "✅ Search endpoint working" || echo "❌ Search failed"
echo ""

# 3. Search with Query
echo "3️⃣  Searching for 'Computer Science'..."
curl -s "http://localhost:5000/api/search/professors?department=Computer%20Science&limit=1" | grep "Computer Science" && echo "✅ Filtering working" || echo "❌ Filtering failed"
echo ""

# 4. Get Departments
echo "4️⃣  Fetching departments..."
curl -s "http://localhost:5000/api/search/departments" | grep "success" && echo "✅ Departments endpoint working" || echo "❌ Departments failed"
echo ""

echo "-----------------------------------"
echo "🎉 Done! If you see checkmarks, your backend is ready."
