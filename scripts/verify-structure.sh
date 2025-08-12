#!/bin/bash

# SkyScout AI - Repository Structure Verification Script
# This script verifies the restructured repository follows best practices

echo "🔍 SkyScout AI - Repository Structure Verification"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track verification results
TOTAL_CHECKS=0
PASSED_CHECKS=0

check_result() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo -e "${BLUE}📁 Checking directory structure...${NC}"

# Check main directories exist
[ -d "apps" ] && check_result 0 "apps/ directory exists" || check_result 1 "apps/ directory missing"
[ -d "libs" ] && check_result 0 "libs/ directory exists" || check_result 1 "libs/ directory missing"
[ -d "docs" ] && check_result 0 "docs/ directory exists" || check_result 1 "docs/ directory missing"
[ -d "infra" ] && check_result 0 "infra/ directory exists" || check_result 1 "infra/ directory missing"
[ -d "scripts" ] && check_result 0 "scripts/ directory exists" || check_result 1 "scripts/ directory missing"
[ -d "tooling" ] && check_result 0 "tooling/ directory exists" || check_result 1 "tooling/ directory missing"

echo -e "${BLUE}📱 Checking applications...${NC}"

# Check app directories
[ -d "apps/web" ] && check_result 0 "Web app exists" || check_result 1 "Web app missing"
[ -d "apps/api" ] && check_result 0 "API app exists" || check_result 1 "API app missing"
[ -d "apps/mcp-server" ] && check_result 0 "MCP server exists" || check_result 1 "MCP server missing"

echo -e "${BLUE}📚 Checking libraries...${NC}"

# Check lib directories
[ -d "libs/ui" ] && check_result 0 "UI library exists" || check_result 1 "UI library missing"
[ -d "libs/shared" ] && check_result 0 "Shared library exists" || check_result 1 "Shared library missing"
[ -d "libs/trpc" ] && check_result 0 "tRPC library exists" || check_result 1 "tRPC library missing"

echo -e "${BLUE}🏗️ Checking infrastructure organization...${NC}"

# Check infra structure
[ -d "infra/docker" ] && check_result 0 "Docker configs organized" || check_result 1 "Docker configs not organized"
[ -d "infra/monitoring" ] && check_result 0 "Monitoring configs organized" || check_result 1 "Monitoring configs not organized"
[ -d "infra/database" ] && check_result 0 "Database configs organized" || check_result 1 "Database configs not organized"

echo -e "${BLUE}📖 Checking documentation organization...${NC}"

# Check docs structure
[ -d "docs/architecture" ] && check_result 0 "Architecture docs organized" || check_result 1 "Architecture docs not organized"
[ -d "docs/performance" ] && check_result 0 "Performance docs organized" || check_result 1 "Performance docs not organized"
[ -d "docs/design" ] && check_result 0 "Design docs organized" || check_result 1 "Design docs not organized"
[ -d "docs/ai-guides" ] && check_result 0 "AI guides organized" || check_result 1 "AI guides not organized"

echo -e "${BLUE}🛠️ Checking scripts organization...${NC}"

# Check scripts structure
[ -d "scripts/setup" ] && check_result 0 "Setup scripts organized" || check_result 1 "Setup scripts not organized"
[ -d "scripts/testing" ] && check_result 0 "Testing scripts organized" || check_result 1 "Testing scripts not organized"
[ -d "scripts/ai-automation" ] && check_result 0 "AI automation scripts organized" || check_result 1 "AI automation scripts not organized"
[ -d "scripts/deployment" ] && check_result 0 "Deployment scripts organized" || check_result 1 "Deployment scripts not organized"

echo -e "${BLUE}🧹 Checking for cleanup (no backup files)...${NC}"

# Check for backup files
BACKUP_FILES=$(find . -path "./node_modules" -prune -o \( -name "*.backup" -o -name "*.bak" -o -name "*~" \) -print 2>/dev/null | wc -l)
[ $BACKUP_FILES -eq 0 ] && check_result 0 "No backup files found" || check_result 1 "$BACKUP_FILES backup files still exist"

# Check for unused README files
README_COUNT=$(find . -path "./node_modules" -prune -o -name "README*.md" -print | grep -v "./README.md" | grep -v "./docs/README.md" | grep -v "./infra/README.md" | grep -v "./scripts/README.md" | wc -l)
[ $README_COUNT -eq 0 ] && check_result 0 "No redundant README files" || check_result 1 "$README_COUNT redundant README files found"

echo -e "${BLUE}⚙️ Checking configuration files...${NC}"

# Check important config files
[ -f "tsconfig.base.json" ] && check_result 0 "TypeScript base config exists" || check_result 1 "TypeScript base config missing"
[ -f "package.json" ] && check_result 0 "Package.json exists" || check_result 1 "Package.json missing"
[ -f ".eslintrc.json" ] && check_result 0 "ESLint config exists" || check_result 1 "ESLint config missing"
[ -f ".prettierrc" ] && check_result 0 "Prettier config exists" || check_result 1 "Prettier config missing"

echo -e "${BLUE}🔗 Checking TypeScript path mapping...${NC}"

# Check if TypeScript paths are correctly configured
if grep -q "@skyscout/ui" tsconfig.base.json && grep -q "@skyscout/shared" tsconfig.base.json; then
    check_result 0 "TypeScript path mapping configured"
else
    check_result 1 "TypeScript path mapping not configured"
fi

echo ""
echo "=================================================="
echo -e "${BLUE}📊 Verification Results${NC}"
echo "=================================================="

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}🎉 All checks passed! ($PASSED_CHECKS/$TOTAL_CHECKS)${NC}"
    echo -e "${GREEN}✨ Repository structure follows best practices${NC}"
    exit 0
else
    FAILED_CHECKS=$((TOTAL_CHECKS - PASSED_CHECKS))
    echo -e "${YELLOW}⚠️  $PASSED_CHECKS/$TOTAL_CHECKS checks passed${NC}"
    echo -e "${RED}❌ $FAILED_CHECKS checks failed${NC}"
    echo -e "${YELLOW}🔧 Please review and fix the failing checks${NC}"
    exit 1
fi
