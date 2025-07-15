# AI Bot Usage Guide

## 🤖 How to Use AI Bots for Autonomous Development

### Method 1: Issue-Based Development (Primary)

1. **Create a GitHub Issue**:

   ```
   Title: [AI-DEV] Implement Card Component for Flight Results
   Labels: ai-development, high-priority, ui-components
   ```

2. **Trigger AI Development**:
   Comment on the issue:

   ```
   /ai-develop implement card component with variants for flight results display
   ```

3. **AI Bot Will**:
   - Create feature branch: `ai-feature/card-component-flight-results`
   - Implement the component following your patterns
   - Write comprehensive tests
   - Create Storybook stories
   - Submit PR for review

### Method 2: Scheduled Autonomous Tasks

Your AI bots will automatically work on tasks from `.github/AI_TASK_QUEUE.md`:

**Current High Priority Tasks Ready for AI**:

- ✅ Input/Form components (COMPLETED)
- 🔄 Card component for flight results (NEXT)
- 🔄 Modal/Dialog components
- 🔄 Flight search API types/schemas

### Method 3: Weekly Maintenance Automation

Every Monday at 9 AM UTC, AI bots will:

- Update dependencies
- Fix linting issues
- Optimize performance
- Update documentation
- Run security audits

## 🎯 Quick Start Commands

### Trigger AI Development Now:

```bash
# For your next high-priority task (Card component)
gh issue create --title "[AI-DEV] Implement Card Component for Flight Results" --label "ai-development,high-priority,ui-components" --body "Implement Card component with variants for displaying flight search results. Follow existing Button component patterns and include comprehensive tests."

# Then comment to trigger:
# /ai-develop implement card component for flight results
```

### Monitor AI Progress:

```bash
# Check running workflows
gh run list

# Monitor AI task queue
cat .github/AI_TASK_QUEUE.md

# Review AI-created PRs
gh pr list --label "ai-generated"
```

## 🔧 AI Bot Capabilities

Your AI bots can autonomously:

### ✅ **Component Development**

- React components with TypeScript
- Storybook stories
- Unit tests with React Testing Library
- Accessibility compliance

### ✅ **API Development**

- tRPC procedures
- Zod validation schemas
- Integration tests
- API documentation

### ✅ **Code Quality**

- ESLint fixes
- Prettier formatting
- TypeScript strict compliance
- Performance optimizations

### ✅ **Documentation**

- README updates
- API documentation
- Component documentation
- Architecture guides

## 📊 Success Metrics

AI bots follow these quality gates:

- ✅ Build must pass
- ✅ All tests must pass
- ✅ 90%+ test coverage
- ✅ TypeScript strict compliance
- ✅ Accessibility score 95+
- ✅ Performance budget maintained

## 🔄 Daily Workflow

**While you're at work, AI bots will**:

1. 🌅 **Morning**: Process overnight issues and start development
2. 🏗️ **Midday**: Continue implementing features, run tests
3. 🔍 **Afternoon**: Create PRs, request reviews
4. 🌙 **Evening**: Ready for your review when you return

**When you return**:

1. Review AI-generated PRs
2. Approve/request changes
3. Create new issues for tomorrow's AI work
4. Monitor application improvements

## 🚨 Getting Started TODAY

Run this to start your first AI development task:

```bash
# 1. Setup the environment
chmod +x scripts/setup-ai-development.sh
./scripts/setup-ai-development.sh

# 2. Create your first AI task
gh issue create \
  --title "[AI-DEV] Implement Card Component for Flight Results" \
  --label "ai-development,high-priority,ui-components" \
  --body "$(cat .github/ISSUE_TEMPLATE/ai-feature-development.md)"

# 3. Monitor progress
gh run list --workflow="AI Code Review & Quality Check"
```

Your AI development environment is production-ready! 🚀
