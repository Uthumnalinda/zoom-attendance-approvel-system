const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// This script initializes the database with a default admin user

async function initializeDatabase() {
  try {
    const dbPath = path.join(__dirname, '../data/attendance.db');
    const db = new Database(dbPath);

    console.log('🔧 Initializing database...');

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS meetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zoom_link TEXT NOT NULL,
        meeting_id TEXT,
        title TEXT,
        date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.exec(`
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

    console.log('✅ Tables created successfully');

    // Check if admin exists
    const adminCheck = db.prepare('SELECT * FROM admins WHERE username = ?').get('admin');
    
    if (!adminCheck) {
      // Create default admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hashedPassword);
      console.log('✅ Default admin created');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  Please change the default password after first login!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    db.close();
    console.log('✅ Database initialization complete!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
