import React, { useState, useEffect } from 'react';

function StudentManager({ apiUrl }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      showMessage('error', 'Failed to fetch students');
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

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({ username: '', full_name: '', email: '' });
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      username: student.username,
      full_name: student.full_name,
      email: student.email || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editingStudent) {
        // Update existing student
        await fetch(`${apiUrl}/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        showMessage('success', 'Student updated successfully');
      } else {
        // Add new student
        await fetch(`${apiUrl}/students/add`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        showMessage('success', 'Student added successfully');
      }
      
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      showMessage('error', 'Operation failed');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showMessage('success', 'Student deleted successfully');
      fetchStudents();
    } catch (error) {
      showMessage('error', 'Failed to delete student');
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
        <h1>Student Management</h1>
        <p>Add, edit, or remove students from the database</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>All Students ({students.length})</h2>
          <button onClick={handleAddStudent} className="btn-primary">
            ➕ Add Student
          </button>
        </div>

        {students.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.username}</td>
                    <td>{student.full_name}</td>
                    <td>{student.email || 'N/A'}</td>
                    <td>
                      <button onClick={() => handleEditStudent(student)} className="btn-success">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="btn-danger">
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
            <p>No students found. Add your first student!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="student123"
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingStudent ? 'Update' : 'Add'} Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManager;
