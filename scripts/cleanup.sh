#!/bin/bash

# SkyScout AI Project Cleanup Script
echo "🧹 Cleaning up SkyScout AI project..."

# Remove build artifacts
echo "📦 Removing build artifacts..."
find . -name ".next" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null
find . -name "dist" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null
find . -name "*.tsbuildinfo" -not -path "./node_modules/*" -delete 2>/dev/null

# Remove performance reports
echo "📊 Removing performance reports..."
find . -name "lighthouse-report.*" -not -path "./node_modules/*" -delete 2>/dev/null
find . -name "bundle-analysis-guide.md" -not -path "./node_modules/*" -delete 2>/dev/null

# Remove temporary files
echo "🗄️ Removing temporary files..."
find . -name "*.log" -not -path "./node_modules/*" -delete 2>/dev/null
find . -name ".DS_Store" -delete 2>/dev/null
find . -name "Thumbs.db" -delete 2>/dev/null

# Clean Nx cache
echo "🔄 Cleaning Nx cache..."
npx nx reset 2>/dev/null || echo "Nx cache already clean"

echo "✅ Project cleanup complete!"
echo ""
echo "📋 What was cleaned:"
echo "  - Build artifacts (.next, dist, *.tsbuildinfo)"
echo "  - Performance reports (lighthouse-report.*, bundle-analysis-guide.md)"
echo "  - Temporary files (*.log, .DS_Store, Thumbs.db)"
echo "  - Nx cache"
echo ""
echo "💡 Run 'npm run build' to regenerate build artifacts if needed."
