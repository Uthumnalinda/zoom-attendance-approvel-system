# Node.js Auto-Installer for Windows
# This script downloads and installs Node.js LTS automatically

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Node.js Automatic Installer" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "WARNING: Not running as Administrator" -ForegroundColor Yellow
    Write-Host "Some installations may require Administrator privileges" -ForegroundColor Yellow
    Write-Host ""
}

# Node.js version to download
$nodeVersion = "20.9.0"
$installerUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
$installerPath = "$env:TEMP\nodejs-installer.msi"

Write-Host "[1/4] Checking existing Node.js installation..." -ForegroundColor Green

# Check if Node.js is already installed
try {
    $nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeInstalled) {
        Write-Host "Node.js is already installed!" -ForegroundColor Yellow
        Write-Host "Version: $(node --version)" -ForegroundColor Yellow
        Write-Host ""
        $reinstall = Read-Host "Do you want to reinstall? (Y/N)"
        if ($reinstall -ne "Y" -and $reinstall -ne "y") {
            Write-Host "Installation cancelled." -ForegroundColor Yellow
            exit
        }
    }
} catch {
    Write-Host "Node.js not found. Proceeding with installation..." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "[2/4] Downloading Node.js v$nodeVersion..." -ForegroundColor Green
Write-Host "URL: $installerUrl" -ForegroundColor Gray
Write-Host "This may take a few minutes depending on your internet speed..." -ForegroundColor Gray
Write-Host ""

try {
    # Download the installer
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to download Node.js installer" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please download manually from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[3/4] Installing Node.js..." -ForegroundColor Green
Write-Host "The installer window will open. Please follow the prompts." -ForegroundColor Gray
Write-Host "IMPORTANT: Keep all default options checked!" -ForegroundColor Yellow
Write-Host ""

try {
    # Run the installer
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /passive /norestart" -Wait
    Write-Host "Installation complete!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Installation failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run the installer manually from: $installerPath" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[4/4] Cleaning up..." -ForegroundColor Green

# Clean up installer file
try {
    Remove-Item $installerPath -Force
    Write-Host "Temporary files removed." -ForegroundColor Green
} catch {
    Write-Host "Could not remove temporary installer file: $installerPath" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: You MUST restart PowerShell for changes to take effect!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Close this PowerShell window" -ForegroundColor White
Write-Host "2. Open a NEW PowerShell window" -ForegroundColor White
Write-Host "3. Run: node --version" -ForegroundColor White
Write-Host "4. Run: npm --version" -ForegroundColor White
Write-Host "5. Navigate to project: cd E:\zoom-attendance-admin" -ForegroundColor White
Write-Host "6. Install dependencies: npm install" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
