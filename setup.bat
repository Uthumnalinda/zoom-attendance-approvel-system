@echo off
echo ============================================
echo Zoom Attendance Admin - Setup Script
echo ============================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo [2/4] Installing dependencies...
echo This may take 2-5 minutes...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo [3/4] Checking environment configuration...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env >nul
    echo.
    echo IMPORTANT: Please edit the .env file and add your Zoom API credentials!
    echo.
    echo You need to:
    echo   1. Go to https://marketplace.zoom.us/
    echo   2. Create a Server-to-Server OAuth app
    echo   3. Copy your credentials to the .env file
    echo.
    echo Press any key to open .env file in notepad...
    pause >nul
    notepad .env
) else (
    echo .env file already exists
)
echo.

echo [4/4] Setup complete!
echo.
echo ============================================
echo Next Steps:
echo ============================================
echo 1. Make sure you've added Zoom credentials to .env
echo 2. Run: npm run dev
echo 3. Login with: admin / admin123
echo 4. Change the default password!
echo.
echo ============================================
echo.

echo Would you like to start the application now? (Y/N)
set /p START_APP=
if /i "%START_APP%"=="Y" (
    echo.
    echo Starting application...
    call npm run dev
) else (
    echo.
    echo Run 'npm run dev' when ready to start!
)

pause
