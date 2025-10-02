const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'attendance.db');
const db = new sqlite3.Database(dbPath);

// Custom promisify for db.run that returns statement info
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this); // 'this' contains lastID, changes, etc.
    });
  });
}

const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database tables
async function initDatabase() {
  try {
    // Students table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admins table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Meetings table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS meetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zoom_link TEXT NOT NULL,
        meeting_id TEXT,
        title TEXT,
        date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Attendance table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meeting_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        join_time TEXT,
        leave_time TEXT,
        duration INTEGER,
        FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Student operations
const studentOps = {
  getAll: async () => {
    return await dbAll('SELECT * FROM students ORDER BY full_name');
  },

  getById: async (id) => {
    return await dbGet('SELECT * FROM students WHERE id = ?', [id]);
  },

  getByUsername: async (username) => {
    return await dbGet('SELECT * FROM students WHERE username = ?', [username]);
  },

  add: async (username, full_name, email) => {
    const result = await dbRun(
      'INSERT INTO students (username, full_name, email) VALUES (?, ?, ?)',
      [username, full_name, email]
    );
    return { lastInsertRowid: result.lastID };
  },

  update: async (id, username, full_name, email) => {
    return await dbRun(
      'UPDATE students SET username = ?, full_name = ?, email = ? WHERE id = ?',
      [username, full_name, email, id]
    );
  },

  delete: async (id) => {
    return await dbRun('DELETE FROM students WHERE id = ?', [id]);
  }
};

// Admin operations
const adminOps = {
  getByUsername: async (username) => {
    return await dbGet('SELECT * FROM admins WHERE username = ?', [username]);
  },

  add: async (username, hashedPassword) => {
    const result = await dbRun(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    return { lastInsertRowid: result.lastID };
  },

  updatePassword: async (username, hashedPassword) => {
    return await dbRun(
      'UPDATE admins SET password = ? WHERE username = ?',
      [hashedPassword, username]
    );
  }
};

// Meeting operations
const meetingOps = {
  getAll: async () => {
    return await dbAll('SELECT * FROM meetings ORDER BY date DESC');
  },

  getById: async (id) => {
    return await dbGet('SELECT * FROM meetings WHERE id = ?', [id]);
  },

  add: async (zoom_link, meeting_id, title, date) => {
    const result = await dbRun(
      'INSERT INTO meetings (zoom_link, meeting_id, title, date) VALUES (?, ?, ?, ?)',
      [zoom_link, meeting_id, title, date]
    );
    return { lastInsertRowid: result.lastID };
  },

  update: async (id, zoom_link, meeting_id, title, date) => {
    return await dbRun(
      'UPDATE meetings SET zoom_link = ?, meeting_id = ?, title = ?, date = ? WHERE id = ?',
      [zoom_link, meeting_id, title, date, id]
    );
  },

  delete: async (id) => {
    return await dbRun('DELETE FROM meetings WHERE id = ?', [id]);
  }
};

// Attendance operations
const attendanceOps = {
  getByMeeting: async (meetingId) => {
    return await dbAll(`
      SELECT 
        a.id,
        a.meeting_id,
        a.student_id,
        a.join_time,
        a.leave_time,
        a.duration,
        s.username,
        s.full_name,
        s.email
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.meeting_id = ?
      ORDER BY a.join_time
    `, [meetingId]);
  },

  add: async (meeting_id, student_id, join_time, leave_time, duration) => {
    const result = await dbRun(
      'INSERT INTO attendance (meeting_id, student_id, join_time, leave_time, duration) VALUES (?, ?, ?, ?, ?)',
      [meeting_id, student_id, join_time, leave_time, duration]
    );
    return { lastInsertRowid: result.lastID };
  },

  update: async (id, join_time, leave_time, duration) => {
    return await dbRun(
      'UPDATE attendance SET join_time = ?, leave_time = ?, duration = ? WHERE id = ?',
      [join_time, leave_time, duration, id]
    );
  },

  delete: async (id) => {
    return await dbRun('DELETE FROM attendance WHERE id = ?', [id]);
  },

  checkExisting: async (meeting_id, student_id) => {
    return await dbGet(
      'SELECT * FROM attendance WHERE meeting_id = ? AND student_id = ?',
      [meeting_id, student_id]
    );
  }
};

module.exports = {
  db,
  initDatabase,
  studentOps,
  adminOps,
  meetingOps,
  attendanceOps
};
