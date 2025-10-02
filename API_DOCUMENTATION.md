# API Documentation

## Base URL

```
http://localhost:3001
```

## Authentication

All endpoints except `/admin/login` require authentication via JWT token.

Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Authentication

#### POST `/admin/login`

Authenticate admin user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

#### POST `/admin/change-password`

Change admin password (requires authentication).

**Request Body:**
```json
{
  "currentPassword": "admin123",
  "newPassword": "newSecurePassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### Students

#### GET `/students`

Get all students (requires authentication).

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "id": 1,
      "username": "john123",
      "full_name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-10-02T10:00:00Z"
    }
  ]
}
```

#### GET `/students/:id`

Get single student by ID (requires authentication).

**Response:**
```json
{
  "success": true,
  "student": {
    "id": 1,
    "username": "john123",
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/students/add`

Add new student (requires authentication).

**Request Body:**
```json
{
  "username": "john123",
  "full_name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "studentId": 1
}
```

#### PUT `/students/:id`

Update student (requires authentication).

**Request Body:**
```json
{
  "username": "john123",
  "full_name": "John Doe Updated",
  "email": "john.new@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully"
}
```

#### DELETE `/students/:id`

Delete student (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

### Meetings

#### GET `/meetings`

Get all meetings (requires authentication).

**Response:**
```json
{
  "success": true,
  "meetings": [
    {
      "id": 1,
      "zoom_link": "https://zoom.us/j/1234567890",
      "meeting_id": "1234567890",
      "title": "Physics Class",
      "date": "2025-10-02",
      "created_at": "2025-10-02T10:00:00Z"
    }
  ]
}
```

#### GET `/meeting/:id`

Get single meeting by ID (requires authentication).

**Response:**
```json
{
  "success": true,
  "meeting": {
    "id": 1,
    "zoom_link": "https://zoom.us/j/1234567890",
    "meeting_id": "1234567890",
    "title": "Physics Class",
    "date": "2025-10-02"
  }
}
```

#### POST `/meeting/upload`

Upload new meeting (requires authentication).

**Request Body:**
```json
{
  "zoom_link": "https://zoom.us/j/1234567890",
  "title": "Physics Class",
  "date": "2025-10-02"
}
```

**Response:**
```json
{
  "success": true,
  "meetingId": 1
}
```

#### DELETE `/meeting/:id`

Delete meeting (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Meeting deleted successfully"
}
```

---

### Attendance

#### GET `/attendance/:meetingId`

Get attendance records for a meeting (requires authentication).

**Response:**
```json
{
  "success": true,
  "attendance": [
    {
      "id": 1,
      "meeting_id": 1,
      "student_id": 1,
      "username": "john123",
      "full_name": "John Doe",
      "email": "john@example.com",
      "join_time": "2025-10-02T10:00:00Z",
      "leave_time": "2025-10-02T11:00:00Z",
      "duration": 3600
    }
  ]
}
```

#### POST `/attendance/fetch-from-zoom`

Fetch attendance from Zoom API (requires authentication).

**Request Body:**
```json
{
  "meetingId": 1,
  "zoomMeetingUUID": "abc123def456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Added 25 attendance records, skipped 3 duplicates"
}
```

#### POST `/attendance/add`

Manually add attendance entry (requires authentication).

**Request Body:**
```json
{
  "meeting_id": 1,
  "student_id": 1,
  "join_time": "2025-10-02T10:00:00Z",
  "leave_time": "2025-10-02T11:00:00Z",
  "duration": 3600
}
```

**Response:**
```json
{
  "success": true,
  "attendanceId": 1
}
```

#### POST `/attendance/report`

Generate PDF attendance report (requires authentication).

**Request Body:**
```json
{
  "meetingId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "reportUrl": "/reports/attendance_1_1696248000000.pdf",
  "filename": "attendance_1_1696248000000.pdf"
}
```

---

### Zoom Integration

#### POST `/zoom/verify-student`

Verify if student username exists (requires authentication).

**Request Body:**
```json
{
  "username": "john123"
}
```

**Response (Student Found):**
```json
{
  "success": true,
  "verified": true,
  "student": {
    "id": 1,
    "username": "john123",
    "full_name": "John Doe"
  }
}
```

**Response (Student Not Found):**
```json
{
  "success": true,
  "verified": false,
  "message": "Student not found"
}
```

---

### Health Check

#### GET `/health`

Check API server status (no authentication required).

**Response:**
```json
{
  "status": "OK",
  "message": "Zoom Attendance Admin API is running"
}
```

---

## Error Responses

All endpoints may return these error formats:

### 400 Bad Request
```json
{
  "error": "Username and password required"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Student not found"
}
```

### 409 Conflict
```json
{
  "error": "Username already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch students"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

---

## CORS

CORS is enabled for all origins in development. In production, restrict to specific origins:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com']
}));
```

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Keep JWT_SECRET secure and random**
3. **Implement rate limiting**
4. **Validate and sanitize all inputs**
5. **Keep dependencies updated**
6. **Use environment variables for sensitive data**
7. **Implement proper logging and monitoring**

---

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:3001/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Students Example
```bash
curl -X GET http://localhost:3001/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add Student Example
```bash
curl -X POST http://localhost:3001/students/add \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"john123","full_name":"John Doe","email":"john@example.com"}'
```

---

## Postman Collection

Import this JSON to Postman for easy API testing:

```json
{
  "info": {
    "name": "Zoom Attendance Admin API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

Add requests to the collection with `{{baseUrl}}` and `{{token}}` variables.
