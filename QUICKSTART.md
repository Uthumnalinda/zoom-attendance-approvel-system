# Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)
```bash
npm install
```

### Step 2: Configure Zoom API (2 minutes)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get Zoom credentials from https://marketplace.zoom.us/
   - Create Server-to-Server OAuth app
   - Copy Account ID, Client ID, and Client Secret

3. Edit `.env` and paste your credentials:
   ```env
   ZOOM_CLIENT_ID=your-client-id
   ZOOM_CLIENT_SECRET=your-client-secret
   ZOOM_ACCOUNT_ID=your-account-id
   JWT_SECRET=make-this-a-random-32-character-string
   ```

### Step 3: Run the App (1 minute)
```bash
npm run dev
```

The app will open automatically!

---

## 📖 First-Time Usage

### 1. Login
- **Username:** admin
- **Password:** admin123
- ⚠️ Change this password immediately!

### 2. Add Students
1. Go to **Students** page
2. Click **Add Student**
3. Fill in:
   - Username (e.g., `john123`)
   - Full Name (e.g., `John Doe`)
   - Email (optional)

### 3. Create a Meeting
1. Go to **Meetings** page
2. Click **Add Meeting**
3. Fill in:
   - Title (e.g., `Physics Class`)
   - Zoom Link (e.g., `https://zoom.us/j/1234567890`)
   - Date

### 4. Track Attendance
1. After your Zoom meeting ends
2. Go to **Attendance** page
3. Select your meeting
4. Click **Fetch from Zoom**
5. Enter the meeting UUID (from Zoom dashboard)
6. View attendance records

### 5. Generate Report
1. Click **Generate PDF**
2. Report downloads automatically
3. Contains all attendance details

---

## 🎯 Common Tasks

### How to find Zoom Meeting UUID?

**Method 1: Zoom Dashboard**
1. Login to zoom.us
2. Go to Reports → Usage Reports
3. Find your meeting
4. Copy the UUID

**Method 2: Zoom API**
```bash
# Use this endpoint (with your access token)
GET https://api.zoom.us/v2/past_meetings/{meetingId}/instances
```

### How to backup data?

Simply copy the `data` folder:
```bash
cp -r data data_backup_2025-10-02
```

### How to reset admin password?

If you forgot the admin password:
1. Delete `data/attendance.db`
2. Restart the app
3. Default credentials will be recreated

### How to build for production?

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

Executables will be in the `dist` folder.

---

## 🔧 Troubleshooting

### App won't start?
```bash
# Clean install
rm -rf node_modules
npm install
npm run dev
```

### Can't connect to Zoom API?
- Verify credentials in `.env`
- Check Zoom app is activated
- Ensure required scopes are added

### Database errors?
```bash
# Reset database
rm -rf data
npm run dev
```

---

## 📚 Need More Help?

- **Full Documentation:** See `README.md`
- **Installation Guide:** See `INSTALLATION.md`
- **API Reference:** See `API_DOCUMENTATION.md`

---

## ✅ Checklist

- [ ] Installed dependencies
- [ ] Created `.env` file
- [ ] Added Zoom credentials
- [ ] Ran `npm run dev`
- [ ] Logged in successfully
- [ ] Changed default password
- [ ] Added test student
- [ ] Created test meeting
- [ ] Ready to use!

---

**You're all set!** 🎉

Start managing your Zoom attendance efficiently.
