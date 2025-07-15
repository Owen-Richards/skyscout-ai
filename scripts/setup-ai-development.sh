#!/bin/bash

# AI Development Setup Script
# This script helps configure your repository for autonomous AI development

echo "🤖 Setting up AI Development Environment for SkyScout AI"
echo "==========================================================="

# Check if GitHub CLI is installed and authenticated
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub. Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated"

# Enable GitHub Actions if not already enabled
echo "📋 Enabling GitHub Actions and required permissions..."

# Set repository settings for AI development
gh repo edit --enable-issues --enable-projects --enable-wiki --enable-discussions

# Enable Actions permissions
echo "⚙️  Configuring repository permissions..."

# Create branch protection rules
echo "🛡️  Setting up branch protection..."
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/lint-and-type-check","ci/test","ci/build"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null || echo "⚠️  Branch protection may already exist"

echo "📝 Next steps to complete AI setup:"
echo ""
echo "1. 🔑 Add required secrets to your repository:"
echo "   gh secret set OPENAI_API_KEY --body 'your-openai-api-key'"
echo "   gh secret set ANTHROPIC_API_KEY --body 'your-anthropic-api-key'"
echo ""
echo "2. 🎯 Create your first AI task:"
echo "   Create an issue with label 'ai-development'"
echo "   Comment: '/ai-develop implement card component for flight results'"
echo ""
echo "3. 🔄 Enable automated maintenance:"
echo "   The weekly maintenance workflow will auto-update dependencies"
echo ""
echo "4. 📊 Monitor AI progress:"
echo "   Check the AI Task Queue: .github/AI_TASK_QUEUE.md"
echo "   Review PRs created by AI bots"
echo ""
echo "✅ Setup complete! Your AI development environment is ready."

# Check current workflow status
echo "📈 Current workflow status:"
gh run list --limit 5
