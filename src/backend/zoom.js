const axios = require('axios');
require('dotenv').config();

const ZOOM_API_BASE = 'https://api.zoom.us/v2';
const ZOOM_OAUTH_BASE = 'https://zoom.us/oauth';

let accessToken = null;
let tokenExpiry = null;

// Get OAuth access token
async function getAccessToken() {
  // Check if token is still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const credentials = Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      `${ZOOM_OAUTH_BASE}/token`,
      null,
      {
        params: {
          grant_type: 'account_credentials',
          account_id: process.env.ZOOM_ACCOUNT_ID
        },
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 min early

    return accessToken;
  } catch (error) {
    console.error('Error getting Zoom access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Zoom');
  }
}

// Get meeting details
async function getMeetingDetails(meetingId) {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${ZOOM_API_BASE}/meetings/${meetingId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching meeting details:', error.response?.data || error.message);
    throw new Error('Failed to fetch meeting details');
  }
}

// Get meeting participants
async function getMeetingParticipants(meetingId) {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${ZOOM_API_BASE}/metrics/meetings/${meetingId}/participants`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page_size: 300 // Max participants per page
        }
      }
    );

    return response.data.participants || [];
  } catch (error) {
    console.error('Error fetching meeting participants:', error.response?.data || error.message);
    throw new Error('Failed to fetch meeting participants');
  }
}

// Get past meeting instances
async function getPastMeetingInstances(meetingId) {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${ZOOM_API_BASE}/past_meetings/${meetingId}/instances`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data.meetings || [];
  } catch (error) {
    console.error('Error fetching past meeting instances:', error.response?.data || error.message);
    return [];
  }
}

// Get participant details for a past meeting
async function getPastMeetingParticipants(meetingUUID) {
  try {
    const token = await getAccessToken();
    // Double encode the UUID as per Zoom API requirements
    const encodedUUID = encodeURIComponent(encodeURIComponent(meetingUUID));
    
    const response = await axios.get(
      `${ZOOM_API_BASE}/past_meetings/${encodedUUID}/participants`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page_size: 300
        }
      }
    );

    return response.data.participants || [];
  } catch (error) {
    console.error('Error fetching past meeting participants:', error.response?.data || error.message);
    throw new Error('Failed to fetch past meeting participants');
  }
}

// Verify if a username exists (for real-time authentication)
function verifyStudent(username, studentDatabase) {
  const student = studentDatabase.find(
    s => s.username.toLowerCase() === username.toLowerCase()
  );
  return student || null;
}

// Parse attendance data from Zoom participants
function parseAttendanceData(participants) {
  return participants.map(participant => ({
    name: participant.name || participant.user_name,
    join_time: participant.join_time,
    leave_time: participant.leave_time,
    duration: participant.duration || 0
  }));
}

// Extract meeting ID from Zoom link
function extractMeetingId(zoomLink) {
  // Match patterns like: zoom.us/j/1234567890 or zoom.us/meeting/1234567890
  const match = zoomLink.match(/(?:zoom\.us\/j\/|zoom\.us\/meeting\/)(\d+)/);
  return match ? match[1] : null;
}

module.exports = {
  getAccessToken,
  getMeetingDetails,
  getMeetingParticipants,
  getPastMeetingInstances,
  getPastMeetingParticipants,
  verifyStudent,
  parseAttendanceData,
  extractMeetingId
};
