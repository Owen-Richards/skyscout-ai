#!/bin/bash

# MCP Server Setup Script for SkyScout AI
echo "🤖 Setting up MCP Server for AI Development"
echo "============================================"

# Navigate to MCP server directory
cd apps/mcp-server

# Install dependencies
echo "📦 Installing MCP Server dependencies..."
npm install

# Build the server
echo "🔨 Building MCP Server..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ MCP Server built successfully!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Add this to your Claude Desktop config:"
    echo ""
    echo '{
  "mcpServers": {
    "skyscout-ai": {
      "command": "node",
      "args": ["'$(pwd)'/dist/index.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}'
    echo ""
    echo "2. Start the MCP server:"
    echo "   npm run mcp:start"
    echo ""
    echo "3. Use VS Code tasks (Ctrl+Shift+P -> Tasks: Run Task):"
    echo "   - MCP: Build and Start"
    echo "   - AI: Performance Analysis" 
    echo "   - AI: Autonomous Development"
    echo ""
    echo "🚀 Ready for AI-powered development!"
else
    echo "❌ Build failed. Check the errors above."
    exit 1
fi
