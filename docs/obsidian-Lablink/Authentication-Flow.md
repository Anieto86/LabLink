# 🔐 LabLink Authentication Flow

## Overview
Comprehensive guide to LabLink's authentication system including JWT tokens, refresh tokens, user registration, login, and session management.

## 📋 Authentication Architecture

### Core Components
- **JWT Access Tokens**: Short-lived (10m) for API access
- **Refresh Tokens**: Long-lived (7d) for token renewal
- **Password Hashing**: bcrypt with salt rounds 10
- **Role-Based Access**: `admin`, `researcher`, `viewer` roles

### Security Features
- Token rotation on refresh
- Automatic token revocation
- Password strength validation
- Active user status checks

## 🔄 Authentication Flows

### 1. User Registration Flow
```
POST /auth/register
├── Validate registration data (name, email, password, role)
├── Check if email already exists
├── Hash password with bcrypt
├── Create user record in database
├── Generate JWT access token (10m expiry)
├── Generate refresh token (7d expiry)
└── Return user data + tokens
```

**Request Body:**
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane.smith@lab.com",
  "password": "SecurePassword123!",
  "role": "researcher"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "email": "jane.smith@lab.com",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "uuid-uuid.uuid-uuid"
}
```

### 2. User Login Flow
```
POST /auth/login
├── Validate login credentials (email, password)
├── Find user by email
├── Check if user is active
├── Compare password with stored hash
├── Generate new JWT access token
├── Generate new refresh token
└── Return tokens
```

**Request Body:**
```json
{
  "email": "jane.smith@lab.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "uuid-uuid.uuid-uuid"
}
```

### 3. Token Refresh Flow
```
POST /auth/refresh
├── Validate refresh token format
├── Find stored refresh token in database
├── Check token expiry and revocation status
├── Generate new access token
├── Rotate refresh token (invalidate old, create new)
├── Update database with new refresh token
└── Return new token pair
```

**Request Body:**
```json
{
  "refresh_token": "uuid-uuid.uuid-uuid"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "new-uuid.new-uuid"
}
```

### 4. Logout Flow
```
POST /auth/logout
├── Validate refresh token
├── Mark refresh token as revoked in database
└── Return success status
```

**Request Body:**
```json
{
  "refresh_token": "uuid-uuid.uuid-uuid"
}
```

**Success Response (204):** No content

## 🛡️ Security Implementation

### JWT Token Structure
```typescript
// Access Token Payload
{
  "sub": 1,                    // User ID
  "email": "jane.smith@lab.com",
  "exp": 1700000000,          // Expiration timestamp
  "iat": 1699999400           // Issued at timestamp
}
```

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Storage**: Only hashed passwords stored
- **Validation**: Client-side + server-side validation

### Token Security
- **Access Token**: Short lifespan (10 minutes)
- **Refresh Token**: Secure rotation on each use
- **Storage**: Refresh tokens stored in database with expiry
- **Revocation**: Immediate invalidation on logout

## 🔍 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role user_role DEFAULT 'viewer',
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX users_email_unique ON users(email);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX refresh_tokens_token_unique ON refresh_tokens(token);
```

## 🚨 Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "detail": "Email already registered"
}
```

#### 401 Unauthorized
```json
{
  "detail": "Invalid credentials"
}
```

#### 401 Invalid Token
```json
{
  "detail": "Invalid refresh token"
}
```

#### 500 Internal Server Error
```json
{
  "detail": "Failed to create user"
}
```

## 🔧 Implementation Details

### Environment Variables
```env
SECRET_KEY=your-super-secret-jwt-key
JWT_ALG=HS256
JWT_EXPIRES=10m
```

### Service Layer Methods
- `AuthService.hash()` - Password hashing
- `AuthService.compare()` - Password verification
- `AuthService.signAccess()` - JWT token creation
- `AuthService.verifyAccess()` - JWT token verification
- `AuthService.genRefresh()` - Refresh token generation
- `AuthService.issueTokens()` - Issue token pair
- `AuthService.rotate()` - Refresh token rotation
- `AuthService.revoke()` - Token revocation

### Repository Layer Methods
- `AuthRepo.createUser()` - User registration
- `AuthRepo.findByEmail()` - User lookup
- `AuthRepo.findById()` - User by ID
- `AuthRepo.insertRefreshToken()` - Store refresh token
- `AuthRepo.findRefreshToken()` - Retrieve refresh token
- `AuthRepo.rotateRefreshToken()` - Update refresh token
- `AuthRepo.revokeRefreshToken()` - Invalidate token

## 🔄 Integration Points

### Client-Side Integration
```typescript
// Store tokens securely
localStorage.setItem('access_token', response.access_token);
localStorage.setItem('refresh_token', response.refresh_token);

// Add to requests
headers: {
  'Authorization': `Bearer ${access_token}`
}

// Auto-refresh on 401
if (response.status === 401) {
  await refreshTokens();
  retry(originalRequest);
}
```

### Middleware Protection
```typescript
// Protected routes
app.use('/api/protected', authMiddleware);

// Role-based access
app.use('/api/admin', requireRole('admin'));
```

## 📊 Monitoring & Analytics

### Security Metrics
- Failed login attempts
- Token refresh frequency
- Session duration tracking
- Suspicious activity detection

### Performance Metrics
- Authentication response times
- Database query performance
- Token validation overhead

## 🛠️ Development Guidelines

### Testing Strategy
- Unit tests for auth services
- Integration tests for auth endpoints
- Security penetration testing
- Load testing for auth endpoints

### Best Practices
- Never log sensitive data (passwords, tokens)
- Implement rate limiting on auth endpoints
- Use HTTPS in production
- Regular security audits
- Token blacklisting for compromised accounts

## 🔗 Related Documentation
- [[Feature-Creation-Flow]] - How to implement new features
- [[Code Flow Trace Template]] - Debugging auth issues
- [[Project Map Template]] - Overall architecture context

---

**Last Updated**: November 2024
**Version**: 1.0
**Reviewer**: Development Team
