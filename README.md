# Zoom Attendance Admin - Desktop Application

A secure desktop application for institute administrators to manage Zoom meeting attendance, verify student identities, and generate attendance reports.

## 🚀 Features

- **Admin Authentication**: Secure login with JWT tokens and password hashing
- **Student Management**: Add, edit, and remove student records
- **Meeting Management**: Upload and track Zoom meeting details
- **Attendance Tracking**: Fetch attendance data from Zoom API automatically
- **PDF Reports**: Generate professional attendance reports
- **Cross-Platform**: Windows, macOS, and Linux support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Zoom account with API credentials

## 🛠️ Installation

### 1. Clone or Extract the Project

```bash
cd zoom-attendance-admin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and configure:

```env
# Server Configuration
PORT=3001
JWT_SECRET=your-secret-key-change-this-in-production

# Zoom API Configuration
ZOOM_CLIENT_ID=your-zoom-client-id
ZOOM_CLIENT_SECRET=your-zoom-client-secret
ZOOM_ACCOUNT_ID=your-zoom-account-id
ZOOM_REDIRECT_URI=http://localhost:3001/zoom/callback

# Database
DB_PATH=./data/attendance.db

# Default Admin Credentials (change after first login)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
```

### 4. Get Zoom API Credentials

1. Go to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Click "Develop" → "Build App"
3. Choose "Server-to-Server OAuth" app type
4. Fill in app details and get your credentials:
   - Client ID
   - Client Secret
   - Account ID
5. Add required scopes:
   - `meeting:read:admin`
   - `user:read:admin`
   - `report:read:admin`

## 🏃 Running the Application

### Development Mode

```bash
# Start backend and frontend separately for development
npm run dev
```

This will:
- Start the Express API server on port 3001
- Start the Vite dev server on port 3000
- Open the Electron window

### Production Mode

```bash
# Build the React app
npm run build

# Start the Electron app
npm start
```

## 📦 Building Executables

### Build for Windows

```bash
npm run build:win
```

This creates a `.exe` installer in the `dist` folder.

### Build for macOS

```bash
npm run build:mac
```

This creates a `.dmg` installer in the `dist` folder.

### Build for Linux

```bash
npm run build:linux
```

This creates `.AppImage` and `.deb` files in the `dist` folder.

### Build for All Platforms

```bash
npm run build:all
```

## 📖 Usage Guide

### First Login

1. Launch the application
2. Use default credentials:
   - Username: `admin`
   - Password: `admin123`
3. **Important**: Change the default password immediately after first login

### Managing Students

1. Navigate to **Students** page
2. Click "Add Student"
3. Enter student details:
   - Username (used for Zoom authentication)
   - Full Name
   - Email (optional)
4. Students can be edited or deleted as needed

### Managing Meetings

1. Navigate to **Meetings** page
2. Click "Add Meeting"
3. Enter meeting details:
   - Title (e.g., "Physics Class - Chapter 5")
   - Zoom Link (e.g., `https://zoom.us/j/1234567890`)
   - Date
4. The meeting ID will be extracted automatically

### Tracking Attendance

1. Navigate to **Attendance** page
2. Select a meeting from the list
3. Click "Fetch from Zoom" to import attendance data
4. Enter the Zoom meeting UUID
   - Find this in your Zoom account dashboard
   - Or use the Zoom API to get past meeting instances
5. Review the attendance records

### Generating Reports

1. After attendance data is loaded
2. Click "Generate PDF"
3. The report will be generated and downloaded
4. Report includes:
   - Student names and usernames
   - Join/leave times
   - Total duration
   - Meeting details

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Local Database**: SQLite database stored locally
- **Admin-Only Access**: Only authenticated admins can access the system

## 🏗️ Project Structure

```
zoom-attendance-admin/
├── src/
│   ├── main/              # Electron main process
│   │   └── main.js
│   ├── renderer/          # React frontend
│   │   ├── App.jsx
│   │   ├── Login.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── StudentManager.jsx
│   │   ├── MeetingManager.jsx
│   │   ├── AttendanceReport.jsx
│   │   └── styles.css
│   └── backend/           # Node.js backend
│       ├── api.js         # Express API routes
│       ├── db.js          # Database operations
│       ├── auth.js        # Authentication logic
│       ├── zoom.js        # Zoom API integration
│       └── pdfGenerator.js # PDF generation
├── public/
│   └── index.html
├── data/                  # SQLite database (auto-created)
├── reports/              # Generated PDF reports (auto-created)
├── package.json
├── vite.config.js
└── .env
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/login` | POST | Admin login |
| `/students` | GET | List all students |
| `/students/add` | POST | Add new student |
| `/students/:id` | PUT | Update student |
| `/students/:id` | DELETE | Delete student |
| `/meetings` | GET | List all meetings |
| `/meeting/upload` | POST | Add new meeting |
| `/meeting/:id` | GET | Get meeting details |
| `/meeting/:id` | DELETE | Delete meeting |
| `/attendance/:meetingId` | GET | Get attendance for meeting |
| `/attendance/fetch-from-zoom` | POST | Fetch from Zoom API |
| `/attendance/report` | POST | Generate PDF report |

## 🐛 Troubleshooting

### Backend server not starting

- Ensure port 3001 is not in use
- Check `.env` file is properly configured
- Run `npm install` to ensure all dependencies are installed

### Cannot connect to Zoom API

- Verify Zoom API credentials in `.env`
- Check that your Zoom app has the required scopes
- Ensure your Zoom account is active

### Database errors

- Delete the `data` folder and restart (this will reset the database)
- Check file permissions on the `data` directory

### Build errors

- Ensure all dependencies are installed: `npm install`
- Clear cache: `npm run clean` (if available) or delete `node_modules` and reinstall
- Check Node.js version (v16+ required)

## 📝 Notes

### Zoom Meeting UUID

To fetch attendance from Zoom, you need the meeting UUID:
- Available in Zoom dashboard under "Reports" → "Usage Reports"
- Can be obtained via Zoom API endpoint `/past_meetings/{meetingId}/instances`
- Format: Usually a long alphanumeric string

### Data Persistence

All data is stored locally in SQLite database:
- Students
- Admins
- Meetings
- Attendance records

**Backup**: Regularly backup the `data` folder to preserve your data.

## 🔮 Future Enhancements (Stretch Goals)

- Email notifications to students/admins
- CSV export of attendance
- Multi-admin roles and permissions
- User profile management
- Cloud sync for multi-device support
- Real-time attendance monitoring during meetings
- Webhook integration for automatic attendance capture

## 📄 License

MIT License - feel free to use and modify for your institution.

## 👥 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Zoom API documentation
3. Create an issue in your project repository

## 🎯 Quick Start Checklist

- [ ] Install Node.js and npm
- [ ] Clone/extract project
- [ ] Run `npm install`
- [ ] Create `.env` file with Zoom credentials
- [ ] Run `npm run dev` to test
- [ ] Login with admin/admin123
- [ ] Change default password
- [ ] Add students
- [ ] Create meetings
- [ ] Test attendance fetching
- [ ] Generate sample report
- [ ] Build executable: `npm run build:win`

---

**Made with ❤️ for Educational Institutions**
