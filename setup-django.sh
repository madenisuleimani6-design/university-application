#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     AMIS Backend - Django Setup & Run Script              ║"
echo "║     Academic Management Information System                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd backend-django || exit 1

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo ""
    echo "Please install Python 3.9+ from: https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔨 Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment exists"
fi

echo ""
echo "🔧 Activating virtual environment..."
source venv/bin/activate

echo "✅ Virtual environment activated"
echo ""

# Upgrade pip
echo "📦 Upgrading pip..."
python -m pip install --upgrade pip > /dev/null 2>&1

# Install dependencies
echo "📦 Installing dependencies from requirements.txt..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your database credentials."
    echo ""
else
    echo "✅ .env file exists"
fi

echo ""
echo "🗄️  Running database migrations..."
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "❌ Migration failed"
    exit 1
fi

echo "✅ Database migrations completed"
echo ""

# Create superuser
echo "👤 Creating admin user..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@amis.edu', 'admin123')
    print("✅ Admin user created: admin / admin123")
else:
    print("✅ Admin user already exists")
EOF

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 AMIS Django Backend Setup Complete!                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Ask user if they want to start the server
read -p "Do you want to start the development server now? (y/n): " START_SERVER

if [ "$START_SERVER" = "y" ] || [ "$START_SERVER" = "Y" ]; then
    echo ""
    echo "🌐 Starting Django development server on http://localhost:8080"
    echo "🔗 API: http://localhost:8080/api/"
    echo "📊 Admin: http://localhost:8080/admin/"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python manage.py runserver 0.0.0.0:8080
else
    echo ""
    echo "To start the server manually, run:"
    echo "  source venv/bin/activate"
    echo "  python manage.py runserver 0.0.0.0:8080"
    echo ""
fi
