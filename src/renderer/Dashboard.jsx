import React, { useState, useEffect } from 'react';

function Dashboard({ apiUrl }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMeetings: 0,
    recentMeetings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [studentsRes, meetingsRes] = await Promise.all([
        fetch(`${apiUrl}/students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/meetings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const studentsData = await studentsRes.json();
      const meetingsData = await meetingsRes.json();

      setStats({
        totalStudents: studentsData.students?.length || 0,
        totalMeetings: meetingsData.meetings?.length || 0,
        recentMeetings: meetingsData.meetings?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to Zoom Attendance Admin System</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-value">{stats.totalStudents}</div>
        </div>
        <div className="stat-card">
          <h3>Total Meetings</h3>
          <div className="stat-value">{stats.totalMeetings}</div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Meetings</h2>
        {stats.recentMeetings.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Meeting ID</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMeetings.map((meeting) => (
                  <tr key={meeting.id}>
                    <td>{meeting.title || 'Untitled Meeting'}</td>
                    <td>{new Date(meeting.date).toLocaleDateString()}</td>
                    <td>{meeting.meeting_id || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No meetings found. Create your first meeting!</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Quick Start Guide</h2>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Add students to the database from the Students page</li>
          <li>Create a new meeting by uploading Zoom meeting details</li>
          <li>After the meeting, fetch attendance data from Zoom</li>
          <li>Generate and download PDF attendance reports</li>
        </ol>
      </div>
    </div>
  );
}

export default Dashboard;
