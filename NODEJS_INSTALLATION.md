# Node.js Installation Guide

## The Issue

You're seeing this error because Node.js (which includes npm) is not installed on your system:
```
npm : The term 'npm' is not recognized...
```

## Solution: Install Node.js

### For Windows (Your Current System)

#### Option 1: Download Installer (Recommended)

1. **Visit Node.js Official Website:**
   - Go to: https://nodejs.org/
   - You'll see two versions:
     - **LTS (Long Term Support)** - Recommended for most users
     - **Current** - Latest features

2. **Download the Installer:**
   - Click the **LTS** version (currently v20.x.x)
   - Download will start automatically
   - File name: `node-v20.x.x-x64.msi`

3. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Click "Next" through the installation wizard
   - **Important:** Keep all default options checked, especially:
     - ✅ Node.js runtime
     - ✅ npm package manager
     - ✅ Add to PATH
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

4. **Verify Installation:**
   - Close and reopen PowerShell (important!)
   - Run these commands:
   ```powershell
   node --version
   npm --version
   ```
   - You should see version numbers like:
   ```
   v20.9.0
   10.1.0
   ```

#### Option 2: Using Winget (Windows Package Manager)

If you have Windows 10/11 with winget:

```powershell
winget install OpenJS.NodeJS.LTS
```

Then restart PowerShell.

#### Option 3: Using Chocolatey

If you have Chocolatey installed:

```powershell
choco install nodejs-lts
```

Then restart PowerShell.

---

## After Installing Node.js

Once Node.js is installed, come back to this directory and run:

```powershell
cd E:\zoom-attendance-admin
npm install
```

This will install all the project dependencies.

---

## Quick Verification Steps

### 1. Check if Node.js is installed:
```powershell
node --version
```

### 2. Check if npm is installed:
```powershell
npm --version
```

### 3. Check PATH (if commands not found):
```powershell
$env:Path -split ';' | Select-String -Pattern 'node'
```

---

## Troubleshooting

### "Still not recognized after installing"

**Solution:** Restart PowerShell
- Close all PowerShell windows
- Open a new PowerShell window
- Try again

### "Permission denied"

**Solution:** Run PowerShell as Administrator
- Right-click PowerShell
- Select "Run as Administrator"
- Try installation again

### "Node.js installed but npm not working"

**Solution:** Reinstall Node.js
- Uninstall Node.js from Windows Settings
- Download fresh installer
- Install again with default options

---

## Next Steps After Installing Node.js

1. **Close and reopen PowerShell** (very important!)

2. **Navigate to project:**
   ```powershell
   cd E:\zoom-attendance-admin
   ```

3. **Install dependencies:**
   ```powershell
   npm install
   ```
   This will take 2-5 minutes.

4. **Configure environment:**
   - Edit `.env` file with your Zoom credentials
   - See INSTALLATION.md for detailed instructions

5. **Run the application:**
   ```powershell
   npm run dev
   ```

---

## System Requirements

### Minimum:
- Windows 7 SP1 or later
- 4 GB RAM
- 500 MB free disk space

### Recommended:
- Windows 10 or 11
- 8 GB RAM
- 2 GB free disk space

---

## Quick Installation Summary

```powershell
# 1. Download Node.js from https://nodejs.org/
# 2. Install the LTS version
# 3. Restart PowerShell
# 4. Verify installation:
node --version
npm --version

# 5. Install project dependencies:
cd E:\zoom-attendance-admin
npm install

# 6. Run the app:
npm run dev
```

---

## Need Help?

- **Node.js Official Docs:** https://nodejs.org/docs/
- **npm Documentation:** https://docs.npmjs.com/
- **Windows Installation Guide:** https://nodejs.org/en/download/package-manager/#windows

---

**Once Node.js is installed, you'll be ready to proceed with the Zoom Attendance Admin setup!**
