#!/bin/bash

# SkyScout AI Context Setup for AI Agents
echo "🤖 Setting up SkyScout AI context for AI agents..."

# Build MCP Server
echo "📦 Building MCP Server..."
cd apps/mcp-server
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ MCP Server built successfully!"
    
    echo ""
    echo "🎯 AI Agent Context Setup Complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Add the config to Claude Desktop:"
    echo "   Copy .github/claude-desktop-config.json to %APPDATA%\\Claude\\claude_desktop_config.json"
    echo ""
    echo "2. Available AI agent tools:"
    echo "   - analyze_project_structure"
    echo "   - generate_component" 
    echo "   - run_performance_analysis"
    echo "   - update_trip_management"
    echo "   - run_tests"
    echo ""
    echo "3. Context resources:"
    echo "   - skyscout://architecture"
    echo "   - skyscout://components"
    echo "   - skyscout://development-guide"
    echo "   - skyscout://project-structure"
    echo "   - skyscout://coding-patterns"
    echo ""
    echo "4. Read .github/AI_CONTEXT_GUIDE.md for comprehensive context"
    echo ""
    echo "🚀 Ready for AI-powered development!"
    
else
    echo "❌ MCP Server build failed. Check errors above."
    exit 1
fi
