import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import StudentManager from './StudentManager';
import MeetingManager from './MeetingManager';
import AttendanceReport from './AttendanceReport';
import Dashboard from './Dashboard';

function AdminDashboard({ onLogout, apiUrl }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>📊 Admin Panel</h2>
          <p>Zoom Attendance System</p>
        </div>
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                🏠 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard/students" className={`nav-link ${isActive('/dashboard/students')}`}>
                👥 Students
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard/meetings" className={`nav-link ${isActive('/dashboard/meetings')}`}>
                📅 Meetings
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard/attendance" className={`nav-link ${isActive('/dashboard/attendance')}`}>
                📋 Attendance
              </Link>
            </li>
          </ul>
        </nav>
        <button onClick={onLogout} className="logout-btn">
          🚪 Logout
        </button>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard apiUrl={apiUrl} />} />
          <Route path="/students" element={<StudentManager apiUrl={apiUrl} />} />
          <Route path="/meetings" element={<MeetingManager apiUrl={apiUrl} />} />
          <Route path="/attendance" element={<AttendanceReport apiUrl={apiUrl} />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
