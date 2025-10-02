@echo off
setlocal

REM Set PATH to include Node.js
set "PATH=%PATH%;C:\Program Files\nodejs"

cd /d "E:\zoom-attendance-admin"

echo Installing sqlite3 with prebuilt binaries...
echo.

REM Try to install sqlite3 separately with fallback to source build disabled
npm install sqlite3 --build-from-source=false

echo.
if %ERRORLEVEL% EQU 0 (
    echo sqlite3 installed successfully!
) else (
    echo Failed to install sqlite3. Trying alternative method...
    npm install sqlite3 --ignore-scripts
)

pause
