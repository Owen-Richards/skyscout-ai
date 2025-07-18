@echo off

REM SkyScout AI Development Environment Setup Script for Windows

echo 🚀 Setting up SkyScout AI development environment...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "apps\auth-service" mkdir "apps\auth-service"
if not exist "apps\search-engine\src" mkdir "apps\search-engine\src"
if not exist "infra\grafana\dashboards" mkdir "infra\grafana\dashboards"
if not exist "nginx\ssl" mkdir "nginx\ssl"
if not exist "logs" mkdir "logs"

REM Install dependencies
echo 📦 Installing Node.js dependencies...
call npm install

REM Install Python dependencies for ML service
echo 🐍 Installing Python dependencies...
if exist "apps\ml-service\requirements.txt" (
    pip install -r apps\ml-service\requirements.txt
)

REM Initialize database schema
echo 🗄️ Setting up database schema...
call npx prisma generate
call npx prisma db push

REM Build Docker images
echo 🐳 Building Docker images...
docker-compose build

REM Start services
echo ▶️ Starting all services...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

echo.
echo 🎉 SkyScout AI development environment is ready!
echo.
echo 🌐 Access the application:
echo    • Frontend: http://localhost:3000
echo    • API: http://localhost:3001
echo    • ML Service: http://localhost:8000
echo    • Grafana: http://localhost:3002 (admin/admin)
echo    • Prometheus: http://localhost:9090
echo    • OpenSearch: http://localhost:9200
echo.
echo 📊 Monitoring:
echo    • Logs: docker-compose logs -f [service_name]
echo    • Stop: docker-compose down
echo    • Restart: docker-compose restart [service_name]
echo.
