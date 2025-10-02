@echo off
echo Setting up Node.js environment and installing dependencies...
echo.

REM Add Node.js to PATH for this session
set PATH=%PATH%;C:\Program Files\nodejs

REM Verify Node.js and npm
echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)

echo Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)

echo.
echo Both Node.js and npm are working!
echo.

REM Navigate to project directory
cd /d E:\zoom-attendance-admin

REM Clean previous installation
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules 2>nul
)

echo.
echo Installing dependencies...
echo This will take 2-5 minutes...
echo.

npm install

if %errorlevel% equ 0 (
    echo.
    echo ===================================
    echo Installation completed successfully!
    echo ===================================
    echo.
    echo Next steps:
    echo 1. Edit .env file with your Zoom credentials
    echo 2. Run: npm run dev
    echo 3. Login with: admin / admin123
    echo.
) else (
    echo.
    echo ===================================
    echo Installation failed!
    echo ===================================
    echo.
    echo Please check the error messages above.
    echo.
)

pause
