import React, { useState, useEffect } from 'react';

function AttendanceReport({ apiUrl }) {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingAttendance, setFetchingAttendance] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [zoomUUID, setZoomUUID] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/meetings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMeetings(data.meetings || []);
    } catch (error) {
      showMessage('error', 'Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSelectMeeting = async (meeting) => {
    setSelectedMeeting(meeting);
    setFetchingAttendance(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/attendance/${meeting.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAttendance(data.attendance || []);
    } catch (error) {
      showMessage('error', 'Failed to fetch attendance');
    } finally {
      setFetchingAttendance(false);
    }
  };

  const handleFetchFromZoom = () => {
    setShowFetchModal(true);
    setZoomUUID('');
  };

  const handleFetchFromZoomSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMeeting || !zoomUUID) return;

    setFetchingAttendance(true);
    setShowFetchModal(false);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/attendance/fetch-from-zoom`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meetingId: selectedMeeting.id,
          zoomMeetingUUID: zoomUUID
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', data.message);
        // Refresh attendance data
        handleSelectMeeting(selectedMeeting);
      } else {
        showMessage('error', data.error || 'Failed to fetch from Zoom');
      }
    } catch (error) {
      showMessage('error', 'Failed to fetch attendance from Zoom');
    } finally {
      setFetchingAttendance(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedMeeting) return;

    setGeneratingReport(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/attendance/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ meetingId: selectedMeeting.id })
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Report generated successfully!');
        // Download the PDF
        window.open(`${apiUrl}${data.reportUrl}`, '_blank');
      } else {
        showMessage('error', data.error || 'Failed to generate report');
      }
    } catch (error) {
      showMessage('error', 'Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const calculateTotalDuration = () => {
    return attendance.reduce((sum, record) => sum + (record.duration || 0), 0);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0 min';
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
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
        <h1>Attendance Reports</h1>
        <p>View and generate attendance reports for meetings</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h2>Select a Meeting</h2>
        {meetings.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Meeting ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((meeting) => (
                  <tr key={meeting.id} style={{ backgroundColor: selectedMeeting?.id === meeting.id ? '#e8f4f8' : 'transparent' }}>
                    <td>{meeting.title || 'Untitled Meeting'}</td>
                    <td>{new Date(meeting.date).toLocaleDateString()}</td>
                    <td>{meeting.meeting_id || 'N/A'}</td>
                    <td>
                      <button onClick={() => handleSelectMeeting(meeting)} className="btn-primary">
                        📋 View Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No meetings found. Create a meeting first!</p>
          </div>
        )}
      </div>

      {selectedMeeting && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2>{selectedMeeting.title || 'Untitled Meeting'}</h2>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
                Date: {new Date(selectedMeeting.date).toLocaleDateString()} | 
                Total Present: {attendance.length}
              </p>
            </div>
            <div>
              <button 
                onClick={handleFetchFromZoom} 
                className="btn-success" 
                disabled={fetchingAttendance}
                style={{ marginRight: '10px' }}
              >
                🔄 Fetch from Zoom
              </button>
              <button 
                onClick={handleGenerateReport} 
                className="btn-primary" 
                disabled={generatingReport || attendance.length === 0}
              >
                {generatingReport ? '⏳ Generating...' : '📄 Generate PDF'}
              </button>
            </div>
          </div>

          {fetchingAttendance ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : attendance.length > 0 ? (
            <>
              <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
                <strong>Summary:</strong> {attendance.length} students attended | 
                Total time: {formatDuration(calculateTotalDuration())}
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Username</th>
                      <th>Join Time</th>
                      <th>Leave Time</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record) => (
                      <tr key={record.id}>
                        <td>{record.full_name}</td>
                        <td>{record.username}</td>
                        <td>
                          {record.join_time ? new Date(record.join_time).toLocaleTimeString() : 'N/A'}
                        </td>
                        <td>
                          {record.leave_time ? new Date(record.leave_time).toLocaleTimeString() : 'N/A'}
                        </td>
                        <td>{formatDuration(record.duration)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>No attendance records found for this meeting.</p>
              <p style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Click "Fetch from Zoom" to import attendance data from Zoom.
              </p>
            </div>
          )}
        </div>
      )}

      {showFetchModal && (
        <div className="modal-overlay" onClick={() => setShowFetchModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Fetch Attendance from Zoom</h2>
            <p style={{ marginBottom: '20px', color: '#7f8c8d', fontSize: '14px' }}>
              Enter the Zoom meeting UUID to fetch participant data. You can find this in your Zoom account's 
              meeting history or via the Zoom API.
            </p>
            <form onSubmit={handleFetchFromZoomSubmit}>
              <div className="form-group">
                <label>Meeting UUID *</label>
                <input
                  type="text"
                  value={zoomUUID}
                  onChange={(e) => setZoomUUID(e.target.value)}
                  placeholder="Enter Zoom meeting UUID"
                  required
                />
                <small style={{ color: '#7f8c8d', fontSize: '12px' }}>
                  Example: abc123def456 or encoded UUID
                </small>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowFetchModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Fetch Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;
