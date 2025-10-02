# Quick Verification Script
# Run this in a NEW PowerShell window to check if Node.js is installed

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Node.js Installation Verification" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
Write-Host ""

# Test Node.js
Write-Host "[1/3] Checking Node.js..." -ForegroundColor Green
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node not found"
    }
} catch {
    Write-Host "✗ Node.js is NOT installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions:" -ForegroundColor Yellow
    Write-Host "1. Make sure you opened a NEW PowerShell window" -ForegroundColor White
    Write-Host "2. Try restarting your computer" -ForegroundColor White
    Write-Host "3. Reinstall Node.js from https://nodejs.org/" -ForegroundColor White
    exit 1
}

Write-Host ""

# Test npm
Write-Host "[2/3] Checking npm..." -ForegroundColor Green
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ npm is installed: v$npmVersion" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host "✗ npm is NOT installed or not in PATH" -ForegroundColor Red
    Write-Host "This is unusual. Please reinstall Node.js." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if we're in the right directory
Write-Host "[3/3] Checking project directory..." -ForegroundColor Green
$currentDir = Get-Location
if ($currentDir.Path -like "*zoom-attendance-admin*") {
    Write-Host "✓ You are in the project directory" -ForegroundColor Green
} else {
    Write-Host "✗ You are NOT in the project directory" -ForegroundColor Yellow
    Write-Host "Run: cd E:\zoom-attendance-admin" -ForegroundColor White
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✓ Verification Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You are ready to proceed! Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Make sure you're in the project directory:" -ForegroundColor White
Write-Host "   cd E:\zoom-attendance-admin" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Install project dependencies:" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Configure your .env file with Zoom credentials" -ForegroundColor White
Write-Host ""
Write-Host "4. Run the application:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
