#!/bin/bash

# Quick AI Bot Activation Script
echo "🤖 Activating AI Development for SkyScout AI"
echo "============================================="

# Check GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ Please install GitHub CLI: https://cli.github.com/"
    exit 1
fi

echo "✅ GitHub CLI found"

# Check current repository
REPO=$(gh repo view --json name,owner | jq -r '.owner.login + "/" + .name')
echo "📂 Repository: $REPO"

# Check workflows
echo "🔄 Available AI Workflows:"
gh workflow list

# Create AI development issue for Card component
echo ""
echo "🎯 Creating AI Development Task..."

ISSUE_BODY="## 🤖 AI Development Request

### Feature Description
Implement Card component for flight search results display.

### Requirements
- Card component with variants (default, elevated, interactive)
- TypeScript support with proper interfaces
- Comprehensive tests
- Storybook stories
- Accessibility compliance

### Technical Notes
Follow existing Button component patterns in libs/ui/src/components/button.tsx

### Priority: HIGH 🔥"

gh issue create \
  --title "[AI-DEV] Implement Card Component for Flight Results" \
  --body "$ISSUE_BODY" \
  --label "ai-development,high-priority,ui-components"

echo "✅ AI Development issue created!"
echo ""
echo "🚀 Next Steps:"
echo "1. Go to your GitHub repository issues"
echo "2. Find the '[AI-DEV] Implement Card Component' issue"
echo "3. Comment: '/ai-develop implement card component for flight results'"
echo "4. AI bot will create a feature branch and start development"
echo ""
echo "📊 Monitor progress:"
echo "- GitHub Actions tab for workflow runs"
echo "- Check PRs for AI-generated code"
echo "- Review .github/AI_TASK_QUEUE.md for status updates"
