# Installation Guide

## Step-by-Step Setup Instructions

### 1. Prerequisites

Ensure you have the following installed on your system:

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

Verify installations:
```bash
node --version
npm --version
```

### 2. Extract/Clone the Project

If you received a zip file:
```bash
# Extract the zip file
# Navigate to the extracted folder
cd zoom-attendance-admin
```

If using Git:
```bash
git clone <your-repository-url>
cd zoom-attendance-admin
```

### 3. Install Dependencies

```bash
npm install
```

This may take 2-5 minutes depending on your internet connection.

### 4. Configure Zoom API

#### Get Zoom Credentials:

1. Go to https://marketplace.zoom.us/
2. Sign in with your Zoom admin account
3. Click **Develop** → **Build App**
4. Select **Server-to-Server OAuth** app type
5. Fill in basic information:
   - App Name: "Attendance Admin"
   - Company Name: Your institution name
   - Developer Contact: Your email
6. Click **Create**
7. Copy these credentials:
   - **Account ID**
   - **Client ID**
   - **Client Secret**

#### Set Required Scopes:

In your Zoom app, add these scopes:
- `meeting:read:admin`
- `user:read:admin`
- `report:read:admin`

Click **Continue** and **Activate** your app.

### 5. Create Environment File

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` file with your credentials:

```env
# Server Configuration
PORT=3001
JWT_SECRET=change-this-to-a-random-secret-key-at-least-32-characters

# Zoom API Configuration
ZOOM_CLIENT_ID=your-client-id-here
ZOOM_CLIENT_SECRET=your-client-secret-here
ZOOM_ACCOUNT_ID=your-account-id-here
ZOOM_REDIRECT_URI=http://localhost:3001/zoom/callback

# Database
DB_PATH=./data/attendance.db

# Default Admin Credentials
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
```

**Important**: Replace all placeholder values!

### 6. Test the Application

```bash
# Run in development mode
npm run dev
```

If successful, you should see:
```
✅ API Server running on http://localhost:3001
📊 Database initialized
🔐 Admin endpoints protected with JWT authentication
Default admin created: username=admin, password=admin123
```

The Electron window should open automatically.

### 7. First Login

1. The app opens to the login screen
2. Use default credentials:
   - Username: `admin`
   - Password: `admin123`
3. After successful login, navigate to Settings (if available) to change the password

### 8. Build for Production (Optional)

#### For Windows:
```bash
npm run build:win
```

Output: `dist/Zoom Attendance Admin Setup x.x.x.exe`

#### For macOS:
```bash
npm run build:mac
```

Output: `dist/Zoom Attendance Admin-x.x.x.dmg`

#### For Linux:
```bash
npm run build:linux
```

Output: `dist/Zoom Attendance Admin-x.x.x.AppImage`

## Troubleshooting Common Issues

### Issue: "Cannot find module"

**Solution:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: "Port 3001 already in use"

**Solution:**
Change the PORT in `.env`:
```env
PORT=3002
```

Also update API_URL in `src/renderer/App.jsx`:
```javascript
const API_URL = 'http://localhost:3002';
```

### Issue: "Zoom API authentication failed"

**Solution:**
1. Verify Zoom credentials in `.env`
2. Check that your Zoom app is **Activated**
3. Confirm all required scopes are added
4. Ensure Account ID is correct

### Issue: Database errors

**Solution:**
```bash
# Delete the database and start fresh
rm -rf data/
npm run dev
```

### Issue: "Cannot connect to server"

**Solution:**
1. Ensure backend is running (port 3001)
2. Check firewall settings
3. Verify `.env` configuration
4. Check console for error messages

## Verifying Installation

After setup, test these features:

1. **Login**: Test admin login
2. **Add Student**: Create a test student record
3. **Add Meeting**: Create a test meeting
4. **View Dashboard**: Check stats display correctly

## Post-Installation Steps

1. **Change Default Password**
   - Login with admin/admin123
   - Navigate to profile/settings
   - Update to a secure password

2. **Import Students**
   - Go to Students page
   - Add your student database
   - Consider bulk import if you have many students

3. **Configure First Meeting**
   - Go to Meetings page
   - Add your first Zoom meeting
   - Test fetching attendance

4. **Backup Database**
   - Locate the `data/` folder
   - Create regular backups of `attendance.db`

## System Requirements

### Minimum:
- OS: Windows 7/8/10/11, macOS 10.13+, Ubuntu 18.04+
- RAM: 4 GB
- Storage: 500 MB free space
- Internet: Broadband connection

### Recommended:
- OS: Windows 10/11, macOS 11+, Ubuntu 20.04+
- RAM: 8 GB or more
- Storage: 2 GB free space
- Internet: High-speed connection

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the main README.md
3. Check Zoom API documentation
4. Verify all configuration files

## Next Steps

Once installed successfully:
- Read the [User Guide](USER_GUIDE.md) (if available)
- Configure Zoom webhook integration (advanced)
- Set up automated backups
- Train staff on system usage

---

**Installation Complete!** 🎉

You're ready to manage attendance efficiently.
