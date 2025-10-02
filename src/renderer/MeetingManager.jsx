import React, { useState, useEffect } from 'react';

function MeetingManager({ apiUrl }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    zoom_link: '',
    title: '',
    date: ''
  });
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
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMeeting = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({ zoom_link: '', title: '', date: today });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await fetch(`${apiUrl}/meeting/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      showMessage('success', 'Meeting added successfully');
      setShowModal(false);
      fetchMeetings();
    } catch (error) {
      showMessage('error', 'Failed to add meeting');
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/meeting/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showMessage('success', 'Meeting deleted successfully');
      fetchMeetings();
    } catch (error) {
      showMessage('error', 'Failed to delete meeting');
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
        <h1>Meeting Management</h1>
        <p>Upload and manage Zoom meeting details</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>All Meetings ({meetings.length})</h2>
          <button onClick={handleAddMeeting} className="btn-primary">
            ➕ Add Meeting
          </button>
        </div>

        {meetings.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Meeting ID</th>
                  <th>Zoom Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((meeting) => (
                  <tr key={meeting.id}>
                    <td>{meeting.title || 'Untitled Meeting'}</td>
                    <td>{new Date(meeting.date).toLocaleDateString()}</td>
                    <td>{meeting.meeting_id || 'N/A'}</td>
                    <td>
                      <a href={meeting.zoom_link} target="_blank" rel="noopener noreferrer">
                        View Link
                      </a>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteMeeting(meeting.id)} className="btn-danger">
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No meetings found. Add your first meeting!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Meeting</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Meeting Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Physics Class - Chapter 5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Zoom Link *</label>
                <input
                  type="url"
                  name="zoom_link"
                  value={formData.zoom_link}
                  onChange={handleInputChange}
                  placeholder="https://zoom.us/j/1234567890"
                  required
                />
                <small style={{ color: '#7f8c8d', fontSize: '12px' }}>
                  Example: https://zoom.us/j/1234567890
                </small>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingManager;
