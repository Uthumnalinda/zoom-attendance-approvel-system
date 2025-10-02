# ⚠️ IMPORTANT: READ THIS AFTER NODE.JS INSTALLATION

## What Just Happened?

The Node.js installer script has been executed. It should have:
1. ✅ Downloaded Node.js v20.9.0
2. ✅ Installed it on your system
3. ✅ Added Node.js and npm to your system PATH

---

## 🔴 CRITICAL: You MUST Restart PowerShell!

Node.js has been installed, but PowerShell needs to be restarted to recognize the new commands.

### How to Restart PowerShell:

**Option 1: Close and Reopen**
1. Close this PowerShell window completely
2. Open a new PowerShell window
3. Navigate to the project: `cd E:\zoom-attendance-admin`

**Option 2: Open New Window (Easier)**
1. Leave this window open
2. Open a NEW PowerShell window
3. Navigate to: `cd E:\zoom-attendance-admin`

---

## ✅ Verify Installation (In NEW PowerShell Window)

Once you have a fresh PowerShell window, run these commands:

```powershell
# Check Node.js
node --version
# Should show: v20.9.0

# Check npm
npm --version
# Should show: 10.x.x
```

---

## 📦 Next Steps (After Verification)

Once both commands show version numbers:

### 1. Navigate to Project
```powershell
cd E:\zoom-attendance-admin
```

### 2. Install Dependencies
```powershell
npm install
```
This will take 2-5 minutes and download ~200 MB.

### 3. Configure Zoom API
Edit the `.env` file with your Zoom credentials:
```powershell
notepad .env
```

### 4. Run the Application
```powershell
npm run dev
```

---

## 🆘 If Still Not Working

### Problem: Commands still not recognized

**Solution A: Check Installation Location**
```powershell
# Check if Node.js is in Program Files
Test-Path "C:\Program Files\nodejs\node.exe"
```

**Solution B: Manually Add to PATH (Temporary)**
```powershell
$env:Path += ";C:\Program Files\nodejs"
node --version
npm --version
```

**Solution C: Restart Computer**
If nothing else works, restart your computer. This ensures all PATH changes take effect.

---

## 🔍 Check Installation Manually

If you want to verify the installation without restarting:

1. Open File Explorer
2. Navigate to: `C:\Program Files\nodejs`
3. You should see:
   - `node.exe`
   - `npm.cmd`
   - `npm`
   - Other files

If these files exist, Node.js is installed correctly. You just need to restart PowerShell.

---

## ⚡ Quick Command Reference

After restarting PowerShell:

```powershell
# Navigate to project
cd E:\zoom-attendance-admin

# Install dependencies
npm install

# Run development server
npm run dev

# Build for Windows
npm run build:win
```

---

## 📞 Need Help?

If you're still having issues after restarting PowerShell:

1. **Check Installation:**
   - Go to Windows Settings
   - Apps & Features
   - Search for "Node.js"
   - Should show "Node.js"

2. **Reinstall if needed:**
   - Uninstall Node.js from Apps & Features
   - Download manually from https://nodejs.org/
   - Install with default options

3. **Check PATH:**
   ```powershell
   $env:Path -split ';' | Select-String -Pattern 'nodejs'
   ```
   Should show: `C:\Program Files\nodejs`

---

## ✨ You're Almost There!

Just restart PowerShell and you'll be ready to go!

**Remember:**
- ✅ Node.js is installed
- 🔄 Just need to restart PowerShell
- 📦 Then run `npm install`
- 🚀 Then `npm run dev`

---

**Close this PowerShell window and open a fresh one now!**
