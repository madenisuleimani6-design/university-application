@echo off
REM AMIS Backend Build Script for Windows

echo.
echo 🔨 Building AMIS Backend...
echo ================================

cd backend

REM Check if Maven is installed
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Maven is not installed on PATH
    echo.
    echo You have two options:
    echo.
    echo Option 1: Use Maven Wrapper (recommended)
    echo    mvnw.cmd clean install
    echo.
    echo Option 2: Install Maven globally
    echo    https://maven.apache.org/download.cgi
    echo.
    exit /b 1
)

REM Clean and build
mvn clean install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo To start the backend, run:
    echo    mvn spring-boot:run
) else (
    echo.
    echo ❌ Build failed!
    exit /b 1
)
