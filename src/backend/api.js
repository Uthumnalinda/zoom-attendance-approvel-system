const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initDatabase, studentOps, adminOps, meetingOps, attendanceOps } = require('./db');
const { hashPassword, comparePassword, generateToken, authenticateToken } = require('./auth');
const { getMeetingDetails, getPastMeetingParticipants, extractMeetingId, parseAttendanceData } = require('./zoom');
const { generateAttendanceReport, generateSummaryText } = require('./pdfGenerator');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for generated PDFs
const reportsDir = path.join(__dirname, '../../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}
app.use('/reports', express.static(reportsDir));

// Initialize database
initDatabase().then(async () => {
  try {
    const existingAdmin = await adminOps.getByUsername('admin');
    if (!existingAdmin) {
      const hashedPassword = await hashPassword('admin123');
      await adminOps.add('admin', hashedPassword);
      console.log('Default admin created: username=admin, password=admin123');
      console.log('⚠️  IMPORTANT: Change the default password after first login!');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}).catch(error => {
  console.error('Database initialization failed:', error);
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Admin login
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const admin = await adminOps.getByUsername(username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await comparePassword(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(admin.id, admin.username);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Change password
app.post('/admin/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    const admin = await adminOps.getByUsername(req.user.username);
    const isValid = await comparePassword(currentPassword, admin.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(newPassword);
    await adminOps.updatePassword(req.user.username, hashedPassword);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ============================================
// STUDENT ROUTES
// ============================================

// Get all students
app.get('/students', authenticateToken, async (req, res) => {
  try {
    const students = await studentOps.getAll();
    res.json({ success: true, students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get single student
app.get('/students/:id', authenticateToken, async (req, res) => {
  try {
    const student = await studentOps.getById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ success: true, student });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Add student
app.post('/students/add', authenticateToken, async (req, res) => {
  try {
    const { username, full_name, email } = req.body;

    if (!username || !full_name) {
      return res.status(400).json({ error: 'Username and full name are required' });
    }

    // Check if username already exists
    const existing = await studentOps.getByUsername(username);
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const result = await studentOps.add(username, full_name, email || '');
    res.json({ success: true, studentId: result.lastInsertRowid });
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Update student
app.put('/students/:id', authenticateToken, async (req, res) => {
  try {
    const { username, full_name, email } = req.body;
    const { id } = req.params;

    if (!username || !full_name) {
      return res.status(400).json({ error: 'Username and full name are required' });
    }

    await studentOps.update(id, username, full_name, email || '');
    res.json({ success: true, message: 'Student updated successfully' });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
app.delete('/students/:id', authenticateToken, async (req, res) => {
  try {
    await studentOps.delete(req.params.id);
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// ============================================
// MEETING ROUTES
// ============================================

// Get all meetings
app.get('/meetings', authenticateToken, async (req, res) => {
  try {
    const meetings = await meetingOps.getAll();
    res.json({ success: true, meetings });
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// Get single meeting
app.get('/meeting/:id', authenticateToken, async (req, res) => {
  try {
    const meeting = await meetingOps.getById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json({ success: true, meeting });
  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({ error: 'Failed to fetch meeting' });
  }
});

// Upload meeting
app.post('/meeting/upload', authenticateToken, async (req, res) => {
  try {
    const { zoom_link, title, date } = req.body;

    if (!zoom_link || !date) {
      return res.status(400).json({ error: 'Zoom link and date are required' });
    }

    const meeting_id = extractMeetingId(zoom_link);
    const result = await meetingOps.add(zoom_link, meeting_id, title || '', date);

    res.json({ success: true, meetingId: result.lastID });
  } catch (error) {
    console.error('Upload meeting error:', error);
    res.status(500).json({ error: 'Failed to upload meeting' });
  }
});

// Delete meeting
app.delete('/meeting/:id', authenticateToken, async (req, res) => {
  try {
    await meetingOps.delete(req.params.id);
    res.json({ success: true, message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({ error: 'Failed to delete meeting' });
  }
});

// ============================================
// ATTENDANCE ROUTES
// ============================================

// Get attendance for a meeting
app.get('/attendance/:meetingId', authenticateToken, async (req, res) => {
  try {
    const attendance = await attendanceOps.getByMeeting(req.params.meetingId);
    res.json({ success: true, attendance });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Fetch attendance from Zoom
app.post('/attendance/fetch-from-zoom', authenticateToken, async (req, res) => {
  try {
    const { meetingId, zoomMeetingUUID } = req.body;

    if (!meetingId || !zoomMeetingUUID) {
      return res.status(400).json({ error: 'Meeting ID and Zoom meeting UUID required' });
    }

    const meeting = await meetingOps.getById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Fetch participants from Zoom
    const participants = await getPastMeetingParticipants(zoomMeetingUUID);
    
    // Get all students
    const students = await studentOps.getAll();
    
    let addedCount = 0;
    let skippedCount = 0;
    let rejectedCount = 0;
    const approvedParticipants = [];
    const rejectedParticipants = [];

    // Match participants with students and add to attendance
    for (const participant of participants) {
      const participantName = participant.name || participant.user_name;
      
      // Try to find matching student by username or full name
      const student = students.find(s => 
        participantName.toLowerCase().includes(s.username.toLowerCase()) ||
        s.username.toLowerCase().includes(participantName.toLowerCase()) ||
        participantName.toLowerCase().includes(s.full_name.toLowerCase()) ||
        s.full_name.toLowerCase().includes(participantName.toLowerCase())
      );

      if (student) {
        // Student found in database - APPROVED
        const existing = await attendanceOps.checkExisting(meetingId, student.id);
        
        if (!existing) {
          await attendanceOps.add(
            meetingId,
            student.id,
            participant.join_time,
            participant.leave_time,
            participant.duration
          );
          addedCount++;
          approvedParticipants.push({
            name: participantName,
            matchedStudent: student.full_name,
            username: student.username,
            status: 'Added'
          });
        } else {
          skippedCount++;
          approvedParticipants.push({
            name: participantName,
            matchedStudent: student.full_name,
            username: student.username,
            status: 'Already exists'
          });
        }
      } else {
        // Student NOT found in database - REJECTED
        rejectedCount++;
        rejectedParticipants.push({
          name: participantName,
          reason: 'Not found in student database',
          status: 'Rejected'
        });
      }
    }

    res.json({
      success: true,
      summary: {
        total: participants.length,
        approved: addedCount + skippedCount,
        added: addedCount,
        skipped: skippedCount,
        rejected: rejectedCount
      },
      message: `✅ Approved: ${addedCount + skippedCount} | ❌ Rejected: ${rejectedCount} | 📝 Added: ${addedCount} new records`,
      approvedParticipants,
      rejectedParticipants
    });
  } catch (error) {
    console.error('Fetch from Zoom error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch attendance from Zoom' });
  }
});

// Add manual attendance entry
app.post('/attendance/add', authenticateToken, async (req, res) => {
  try {
    const { meeting_id, student_id, join_time, leave_time, duration } = req.body;

    if (!meeting_id || !student_id) {
      return res.status(400).json({ error: 'Meeting ID and student ID required' });
    }

    // Check if already exists
    const existing = await attendanceOps.checkExisting(meeting_id, student_id);
    if (existing) {
      return res.status(409).json({ error: 'Attendance record already exists' });
    }

    const result = await attendanceOps.add(meeting_id, student_id, join_time, leave_time, duration || 0);
    res.json({ success: true, attendanceId: result.lastID });
  } catch (error) {
    console.error('Add attendance error:', error);
    res.status(500).json({ error: 'Failed to add attendance' });
  }
});

// Generate PDF report
app.post('/attendance/report', authenticateToken, async (req, res) => {
  try {
    const { meetingId } = req.body;

    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID required' });
    }

    const meeting = await meetingOps.getById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const attendance = await attendanceOps.getByMeeting(meetingId);
    
    if (attendance.length === 0) {
      return res.status(404).json({ error: 'No attendance records found' });
    }

    // Generate PDF
    const filename = `attendance_${meetingId}_${Date.now()}.pdf`;
    const outputPath = path.join(reportsDir, filename);

    await generateAttendanceReport(meeting, attendance, outputPath);

    res.json({
      success: true,
      message: 'Report generated successfully',
      reportUrl: `/reports/${filename}`,
      filename
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Verify student by username or name (for Zoom webhook/integration)
app.post('/zoom/verify-student', authenticateToken, async (req, res) => {
  try {
    const { username, name } = req.body;

    if (!username && !name) {
      return res.status(400).json({ error: 'Username or name required' });
    }

    // Try to find by username first
    let student = null;
    if (username) {
      student = await studentOps.getByUsername(username);
    }

    // If not found by username, try to find by name
    if (!student && name) {
      const allStudents = await studentOps.getAll();
      student = allStudents.find(s => 
        s.full_name.toLowerCase() === name.toLowerCase() ||
        s.full_name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(s.full_name.toLowerCase())
      );
    }

    if (student) {
      res.json({
        success: true,
        approved: true,
        verified: true,
        student: {
          id: student.id,
          username: student.username,
          full_name: student.full_name,
          email: student.email
        },
        message: '✅ Student verified and approved'
      });
    } else {
      res.json({
        success: true,
        approved: false,
        verified: false,
        message: '❌ Student not found in database - Access denied'
      });
    }
  } catch (error) {
    console.error('Verify student error:', error);
    res.status(500).json({ error: 'Failed to verify student' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Zoom Attendance Admin API is running' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database initialized`);
  console.log(`🔐 Admin endpoints protected with JWT authentication`);
});

module.exports = { app, server };
