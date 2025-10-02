@echo off
setlocal

REM Set PATH to include Node.js
set "PATH=%PATH%;C:\Program Files\nodejs"

REM Go to project directory
cd /d "E:\zoom-attendance-admin"

REM Show Node version
echo Node.js version:
node --version

echo.
echo npm version:
npm --version

echo.
echo Starting npm install...
echo This will take 2-5 minutes...
echo.

REM Run npm install
npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo SUCCESS! Installation completed!
    echo ====================================
    echo.
) else (
    echo.
    echo ====================================
    echo ERROR! Installation failed!
    echo ====================================
    echo.
)

pause
