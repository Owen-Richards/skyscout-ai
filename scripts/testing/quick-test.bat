@echo off
REM SkyScout AI Quick Test Script for Windows
REM Fast performance and bundle testing

echo 🚀 SkyScout AI Quick Test
echo ========================

REM Navigate to project root
cd /d "%~dp0\.."

REM Quick build test
echo 📦 Quick build test...
cd apps\web
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    
    REM Run bundle size check
    echo 🎯 Checking bundle sizes...
    call npm run bundle:size-limit
    
    REM Run bundle analysis
    echo 📊 Analyzing bundles...
    call npm run bundle:analyze
    
    echo ✨ Quick test complete!
    echo 💡 For full performance testing, run: npm run test:performance
) else (
    echo ❌ Build failed!
    echo 💡 Fix build errors before running performance tests
)

pause
