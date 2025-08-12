# SkyScout AI Scripts

## 📁 Script Organization

### 🛠️ Setup Scripts

Development environment and service setup automation.

- [`setup-dev.bat`](./setup/setup-dev.bat) - Windows development setup
- [`setup-dev.sh`](./setup/setup-dev.sh) - Unix/Linux development setup
- [`setup-mcp.sh`](./setup/setup-mcp.sh) - Model Context Protocol server setup

### 🧪 Testing Scripts

Performance testing, monitoring, and quality assurance.

- [`quick-test.bat`](./testing/quick-test.bat) - Windows quick test runner
- [`quick-test.sh`](./testing/quick-test.sh) - Unix/Linux quick test runner
- [`test-performance.js`](./testing/test-performance.js) - Performance testing automation
- [`performance-monitor.js`](./testing/performance-monitor.js) - Runtime performance monitoring

### 🤖 AI Automation

AI-powered development tools and autonomous workflows.

- [`activate-ai-bots.sh`](./ai-automation/activate-ai-bots.sh) - AI development bot activation
- [`ai-bot-daily-workflow.md`](./ai-automation/ai-bot-daily-workflow.md) - Daily AI workflow documentation
- [`autonomous-dev.js`](./ai-automation/autonomous-dev.js) - Autonomous development automation
- [`setup-ai-context.sh`](./ai-automation/setup-ai-context.sh) - AI context initialization
- [`setup-ai-development.sh`](./ai-automation/setup-ai-development.sh) - AI development environment setup

### 🚀 Deployment

Production deployment and infrastructure management.

- [`deploy-prod.sh`](./deployment/deploy-prod.sh) - Production deployment automation

### 🧹 Maintenance

Code cleanup and maintenance utilities.

- [`cleanup.sh`](./cleanup.sh) - Repository cleanup and optimization

## 🚀 Quick Start

### Development Setup

```bash
# Windows
scripts/setup/setup-dev.bat

# Unix/Linux/macOS
scripts/setup/setup-dev.sh
```

### Testing

```bash
# Quick tests
scripts/testing/quick-test.sh

# Performance monitoring
node scripts/testing/performance-monitor.js
```

### AI Automation

```bash
# Activate AI development bots
scripts/ai-automation/activate-ai-bots.sh

# Setup AI development environment
scripts/ai-automation/setup-ai-development.sh
```

### Production Deployment

```bash
# Deploy to production
scripts/deployment/deploy-prod.sh
```

## 📋 Script Permissions

Ensure scripts have proper execution permissions:

```bash
# Make all scripts executable
find scripts/ -name "*.sh" -exec chmod +x {} \;
```

---

_Scripts follow Unix philosophy: do one thing well, compose well with others, and handle text streams._
