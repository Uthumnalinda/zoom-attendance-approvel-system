@echo off
echo ========================================
echo Zoom Attendance Admin - Quick Start
echo ========================================
echo.

REM Set PATH
set "PATH=%PATH%;C:\Program Files\nodejs"

REM Go to project directory  
cd /d "E:\zoom-attendance-admin"

echo Checking configuration...
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create .env file with your Zoom credentials.
    pause
    exit /b 1
)

echo.
echo Starting application...
echo.
echo This will:
echo - Start backend API on http://localhost:3001
echo - Start frontend on http://localhost:3000
echo - Open Electron desktop window
echo.
echo Press Ctrl+C to stop the application
echo.

REM Run the app
npm run dev

pause
