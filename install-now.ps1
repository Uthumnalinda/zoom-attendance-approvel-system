# Add Node.js to PATH for this session
$env:Path = $env:Path + ";C:\Program Files\nodejs"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Zoom Attendance Admin - Installation" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verify Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version
    Write-Host "[OK] Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Red
    pause
    exit 1
}

# Verify npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = & npm --version
    Write-Host "[OK] npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm not found!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take 2-5 minutes..." -ForegroundColor Yellow
Write-Host ""

# Navigate to project directory
Set-Location "E:\zoom-attendance-admin"

# Clean old installation
if (Test-Path "node_modules") {
    Write-Host "Cleaning old installation..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
}

# Install dependencies
& npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "===================================" -ForegroundColor Green
    Write-Host "[SUCCESS] Installation completed!" -ForegroundColor Green
    Write-Host "===================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Edit .env file with your Zoom credentials" -ForegroundColor White
    Write-Host "2. Run: npm run dev" -ForegroundColor White
    Write-Host "3. Login with: admin / admin123" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "===================================" -ForegroundColor Red
    Write-Host "[ERROR] Installation failed!" -ForegroundColor Red
    Write-Host "===================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
    Write-Host ""
}

pause
