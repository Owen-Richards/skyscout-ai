#!/usr/bin/env node

/**
 * SkyScout AI Bundle & Performance Testing Suite
 * Run from project root to test all applications
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    log(`🔄 Running: ${command}`, 'blue');
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    return false;
  }
}

async function testWebApp() {
  log('\n🌐 Testing Web Application...', 'bold');

  const webDir = path.join(process.cwd(), 'apps', 'web');

  if (!fs.existsSync(webDir)) {
    log('❌ Web app directory not found!', 'red');
    return false;
  }

  const results = {
    build: false,
    bundleAnalysis: false,
    sizeLimit: false,
    lighthouse: false,
  };

  // Build the application
  log('\n📦 Building web application...', 'cyan');
  results.build = runCommand('npm run build', webDir);

  if (!results.build) {
    log('❌ Build failed, skipping other tests', 'red');
    return results;
  }

  // Run bundle analysis
  log('\n📊 Running bundle analysis...', 'cyan');
  results.bundleAnalysis = runCommand('npm run bundle:analyze', webDir);

  // Check size limits
  log('\n🎯 Checking size limits...', 'cyan');
  results.sizeLimit = runCommand('npm run bundle:size-limit', webDir);

  // Performance test (includes Lighthouse)
  log('\n🚀 Running performance tests...', 'cyan');
  results.lighthouse = runCommand('npm run test:performance', webDir);

  return results;
}

function generateReport(results) {
  log('\n📋 Test Results Summary:', 'bold');
  log('========================', 'blue');

  const tests = [
    { name: 'Build', passed: results.build },
    { name: 'Bundle Analysis', passed: results.bundleAnalysis },
    { name: 'Size Limits', passed: results.sizeLimit },
    { name: 'Lighthouse Audit', passed: results.lighthouse },
  ];

  tests.forEach(test => {
    const status = test.passed ? '✅ PASS' : '❌ FAIL';
    const color = test.passed ? 'green' : 'red';
    log(`${test.name}: ${status}`, color);
  });

  const passedCount = tests.filter(t => t.passed).length;
  const totalTests = tests.length;

  log(
    `\n📈 Overall: ${passedCount}/${totalTests} tests passed`,
    passedCount === totalTests ? 'green' : 'yellow'
  );

  if (passedCount < totalTests) {
    log('\n💡 Recommendations:', 'magenta');
    if (!results.build) {
      log('• Fix build errors before running other tests', 'yellow');
    }
    if (!results.bundleAnalysis) {
      log('• Check bundle analysis script for errors', 'yellow');
    }
    if (!results.sizeLimit) {
      log('• Review and optimize bundle sizes', 'yellow');
    }
    if (!results.lighthouse) {
      log('• Ensure development server is properly configured', 'yellow');
    }
  }
}

async function main() {
  log('🚀 SkyScout AI Testing Suite', 'bold');
  log('============================', 'blue');
  log('Testing bundle size, performance, and optimization', 'cyan');

  const results = await testWebApp();
  generateReport(results);

  log('\n✨ Testing complete!', 'green');
  log('\n📁 Check the following directories for detailed reports:', 'cyan');
  log('• apps/web/reports/ - Performance and bundle reports', 'reset');
  log('• apps/web/.next/analyze/ - Bundle analysis files', 'reset');

  log('\n💡 Quick commands for ongoing development:', 'magenta');
  log('• npm run dev - Start development server', 'reset');
  log('• npm run build - Build for production', 'reset');
  log(
    '• cd apps/web && npm run analyze - Interactive bundle analyzer',
    'reset'
  );
  log(
    '• cd apps/web && npm run test:performance - Performance testing',
    'reset'
  );
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testWebApp, generateReport };
