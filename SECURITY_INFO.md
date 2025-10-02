# 🔒 Security Information

## Authentication System

### How It Works

1. **Login Process:**
   - User enters username and password
   - Backend verifies credentials against database
   - If valid, backend generates a JWT (JSON Web Token)
   - Token is stored in browser's localStorage
   - Token is sent with every API request

2. **Token Validation:**
   - When app loads, it validates the stored token with the backend
   - If token is invalid or expired, user is redirected to login
   - All API endpoints (except login) require valid token
   - Invalid/expired tokens return 401 Unauthorized

3. **Protected Routes:**
   - Frontend: React Router protects dashboard routes
   - Backend: `authenticateToken` middleware on all endpoints
   - No access to data without valid authentication

### Security Measures in Place

✅ **Backend Security:**
- All admin passwords are hashed with bcrypt
- JWT tokens with expiration (24 hours)
- CORS enabled for security
- All API endpoints protected (except `/admin/login` and `/health`)
- SQL injection protection (parameterized queries)

✅ **Frontend Security:**
- Route protection with React Router
- Token validation on app load
- Automatic redirect to login if unauthorized
- Token stored securely in localStorage
- Logout clears all authentication data

### Current Credentials

**Default Admin Account:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT**: Change the default password immediately!

### Changing the Admin Password

1. Login to the dashboard
2. Click on "Change Password"
3. Enter current password
4. Enter new password
5. Confirm new password

### API Endpoints Security

**Public Endpoints:**
- `POST /admin/login` - Login
- `GET /health` - Health check

**Protected Endpoints (Require Authentication):**
- All `/students/*` endpoints
- All `/meetings/*` endpoints
- All `/attendance/*` endpoints
- `POST /admin/change-password`

### How Tokens Work

**Token Format:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Contains:**
- Admin ID
- Username
- Expiration time (24 hours)

**Token is sent in headers:**
```javascript
headers: {
  'Authorization': 'Bearer <token>'
}
```

### Session Management

- **Session Duration:** 24 hours
- **Auto-logout:** When token expires or is invalid
- **Manual Logout:** Clears token from localStorage

### What Happens If Unauthorized Access is Attempted

1. **Frontend Protection:**
   - User is redirected to login page
   - Dashboard routes are inaccessible

2. **Backend Protection:**
   - API returns 401 Unauthorized
   - No data is returned
   - Error message: "No token provided" or "Invalid token"

3. **Token Validation Fails:**
   - User is automatically logged out
   - Redirected to login page
   - Must re-authenticate

### Best Practices for Production

1. **Change Default Credentials:**
   ```sql
   -- Change admin password immediately after first login
   ```

2. **Secure JWT Secret:**
   - Edit `.env` file
   - Change `JWT_SECRET` to a long random string
   - Use at least 32 characters
   - Example: `JWT_SECRET=your-super-secure-random-string-here-at-least-32-chars`

3. **Secure Zoom API Credentials:**
   - Keep `ZOOM_CLIENT_SECRET` confidential
   - Don't commit `.env` to version control
   - Use environment variables in production

4. **Regular Security Updates:**
   - Keep Node.js updated
   - Update npm packages regularly: `npm audit fix`
   - Monitor for security vulnerabilities

### Testing Authentication

**Test 1: Login Required**
1. Open browser in incognito/private mode
2. Go to `http://localhost:3000`
3. Should see login page
4. Cannot access dashboard without login

**Test 2: Invalid Token**
1. Open browser DevTools (F12)
2. Go to Application > LocalStorage
3. Change or delete the token
4. Refresh page
5. Should be redirected to login

**Test 3: API Protection**
1. Try accessing API without token:
   ```bash
   curl http://localhost:3001/students
   ```
2. Should get: `{"error": "No token provided"}`

3. Try with invalid token:
   ```bash
   curl -H "Authorization: Bearer invalid_token" http://localhost:3001/students
   ```
4. Should get: `{"error": "Invalid token"}`

### Current Security Status

✅ All routes protected  
✅ Token validation working  
✅ Passwords hashed  
✅ JWT authentication implemented  
✅ CORS configured  
✅ No SQL injection vulnerabilities  

### Logs and Monitoring

**Backend Logs Show:**
- API server status
- Database initialization
- Authentication attempts
- Errors and warnings

**Check logs in terminal where app is running**

---

**Your application is now secure!** 🔒

Only authenticated admins can access the system and manage student attendance.
