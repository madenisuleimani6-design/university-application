#!/bin/bash
# AMIS Backend Build Script
cd backend

echo "🔨 Building AMIS Backend..."
echo "================================"

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven or use:"
    echo "   ./mvnw (Linux/Mac) or mvnw.cmd (Windows)"
    exit 1
fi

# Clean and build
mvn clean install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "To start the backend, run:"
    echo "   mvn spring-boot:run"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
