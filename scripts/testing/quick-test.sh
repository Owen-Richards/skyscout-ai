#!/bin/bash

# SkyScout AI Quick Test Script
# Fast performance and bundle testing

echo "🚀 SkyScout AI Quick Test"
echo "========================"

# Navigate to project root
cd "$(dirname "$0")/.."

# Quick build test
echo "📦 Quick build test..."
cd apps/web
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Run bundle size check
    echo "🎯 Checking bundle sizes..."
    npm run bundle:size-limit
    
    # Run bundle analysis
    echo "📊 Analyzing bundles..."
    npm run bundle:analyze
    
    echo "✨ Quick test complete!"
    echo "💡 For full performance testing, run: npm run test:performance"
else
    echo "❌ Build failed!"
    echo "💡 Fix build errors before running performance tests"
fi
