#!/bin/bash
# Quick Deployment Setup Script
# Run this to prepare your project for deployment

echo "🚀 Email Tracker - Deployment Preparation"
echo "========================================="
echo ""

# Check if in correct directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "✅ Step 1: Installing dependencies..."
cd backend
pip install -r requirements.txt
cd ../frontend
npm install
cd ..
echo "✅ Dependencies installed"

echo ""
echo "✅ Step 2: Building frontend..."
cd frontend
npm run build
cd ..
echo "✅ Frontend built successfully"

echo ""
echo "✅ Step 3: Checking configuration files..."
if [ -f "backend/Procfile" ]; then
    echo "✅ Procfile found"
else
    echo "❌ Procfile missing - create it in backend/"
fi

if [ -f ".gitignore" ]; then
    echo "✅ .gitignore found"
else
    echo "❌ .gitignore missing"
fi

echo ""
echo "✅ Step 4: Git setup..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "✅ Git repository exists"
    echo "📝 Last commit:"
    git log -1 --oneline
else
    echo "⚠️  Git repository not found. Initialize with: git init"
fi

echo ""
echo "✅ Step 5: Required files check..."
files=("backend/Procfile" "backend/runtime.txt" "frontend/.env.production" ".gitignore")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
    fi
done

echo ""
echo "========================================="
echo "🎯 Next steps:"
echo ""
echo "1. Create accounts:"
echo "   - Vercel: https://vercel.com"
echo "   - Render: https://render.com"
echo "   - Supabase: https://supabase.com"
echo ""
echo "2. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin main"
echo ""
echo "3. Follow DEPLOYMENT_GUIDE.md for step-by-step instructions"
echo ""
echo "4. Or follow DEPLOYMENT_CHECKLIST.md for quick reference"
echo ""
echo "========================================="
