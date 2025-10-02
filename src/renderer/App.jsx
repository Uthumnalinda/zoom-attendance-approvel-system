import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';

const API_URL = 'http://localhost:3001';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in and validate token
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token by making a test API call
          const response = await fetch(`${API_URL}/students`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Network error or backend is down
          console.error('Failed to validate token:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} apiUrl={API_URL} />
            )
          }
        />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <AdminDashboard onLogout={handleLogout} apiUrl={API_URL} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
