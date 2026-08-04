@echo off
REM AMIS Django Backend Setup Script for Windows

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     AMIS Backend - Django Setup & Run Script              ║
echo ║     Academic Management Information System                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd backend-django

REM Check if Python is installed
python --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python is not installed or not in PATH
    echo.
    echo Please install Python 3.9+ from: https://www.python.org/downloads/
    exit /b 1
)

echo ✅ Python found
echo.

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 🔨 Creating virtual environment...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to create virtual environment
        exit /b 1
    )
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment exists
)

echo.
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

echo ✅ Virtual environment activated
echo.

REM Upgrade pip
echo 📦 Upgrading pip...
python -m pip install --upgrade pip >nul 2>nul

REM Install dependencies
echo 📦 Installing dependencies from requirements.txt...
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Check for .env file
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from .env.example...
    copy .env.example .env
    echo ✅ .env file created. Please edit it with your database credentials.
    echo.
) else (
    echo ✅ .env file exists
)

echo.
echo 🗄️  Running database migrations...
python manage.py migrate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Migration failed
    exit /b 1
)

echo ✅ Database migrations completed
echo.

REM Create superuser
echo 👤 Creating admin user...
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@amis.edu', 'admin123')
    print("✅ Admin user created: admin / admin123")
else:
    print("✅ Admin user already exists")
EOF

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🚀 AMIS Django Backend Setup Complete!                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Ask user if they want to start the server
set /p START_SERVER="Do you want to start the development server now? (y/n): "
if /i "%START_SERVER%"=="y" (
    echo.
    echo 🌐 Starting Django development server on http://localhost:8080
    echo 🔗 API: http://localhost:8080/api/
    echo 📊 Admin: http://localhost:8080/admin/
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    python manage.py runserver 0.0.0.0:8080
) else (
    echo.
    echo To start the server manually, run:
    echo   venv\Scripts\activate.bat
    echo   python manage.py runserver 0.0.0.0:8080
    echo.
)
