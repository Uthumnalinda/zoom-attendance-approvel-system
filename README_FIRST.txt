╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║          🔴 STOP! READ THIS BEFORE PROCEEDING 🔴              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

The Node.js installation script has been executed!


┌────────────────────────────────────────────────────────────────┐
│ STEP 1: CLOSE THIS POWERSHELL WINDOW                          │
│                                                                │
│ Why? PowerShell needs to restart to recognize Node.js         │
│                                                                │
│ → Click the X button to close this window                     │
└────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────┐
│ STEP 2: OPEN A NEW POWERSHELL WINDOW                          │
│                                                                │
│ How? Press Windows key, type "PowerShell", press Enter        │
└────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────┐
│ STEP 3: VERIFY NODE.JS IS INSTALLED                           │
│                                                                │
│ In the NEW PowerShell window, run:                            │
│                                                                │
│   node --version                                               │
│   npm --version                                                │
│                                                                │
│ You should see version numbers like:                          │
│   v20.9.0                                                      │
│   10.1.0                                                       │
│                                                                │
│ OR use the verification script:                               │
│                                                                │
│   cd E:\zoom-attendance-admin                                  │
│   .\verify-installation.ps1                                    │
└────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────┐
│ STEP 4: INSTALL PROJECT DEPENDENCIES                          │
│                                                                │
│ Once Node.js is verified:                                     │
│                                                                │
│   cd E:\zoom-attendance-admin                                  │
│   npm install                                                  │
│                                                                │
│ This will take 2-5 minutes                                    │
└────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────┐
│ STEP 5: RUN THE APPLICATION                                   │
│                                                                │
│   npm run dev                                                  │
│                                                                │
│ The app will open automatically!                              │
└────────────────────────────────────────────────────────────────┘


╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  IF COMMANDS STILL NOT RECOGNIZED:                            ║
║                                                                ║
║  1. Restart your computer (this always works!)                ║
║  2. Download manually from https://nodejs.org/                ║
║  3. Run the installer with default options                    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝


Quick Reference:
  📥 Download: https://nodejs.org/
  📂 Project: E:\zoom-attendance-admin
  ✅ Verify: .\verify-installation.ps1
  📦 Install: npm install
  🚀 Run: npm run dev
  📚 Help: Read NODEJS_INSTALLATION.md


CLOSE THIS WINDOW NOW AND OPEN A NEW ONE!
