# API Reference

This documentation describes all available endpoints in the LabLink API, including request/response schemas and examples.

## 🌐 Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## 🔐 Authentication

LabLink uses **JWT (JSON Web Tokens)** for authentication. Most endpoints require a valid token.

### **Authentication Header**
```http
Authorization: Bearer <your-jwt-token>
```

### **Authentication Flow**
1. **Login** → Get access token (24h) and refresh token (7d)
2. **Use access token** in requests to protected endpoints
3. **Refresh token** when access token expires

---

## 📡 Endpoints

### **Authentication (`/auth`)**

#### `POST /auth/login`
Authenticate user and obtain JWT tokens.

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER",
    "is_active": true
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

**Response Error (401):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

**Response Error (400):**
```json
{
  "error": "Bad Request",
  "message": "Invalid email address",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

#### `POST /auth/refresh`
Renew access token using refresh token.

**Request:**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Success (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

**Response Error (401):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired refresh token"
}
```

---

### **Users (`/users`)**

#### `GET /users/me`
Get authenticated user information.

**Request:**
```http
GET /users/me
Authorization: Bearer <access-token>
```

**Response Success (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "role": "USER",
  "is_active": true
}
```

**Response Error (401):**
```json
{
  "error": "Unauthorized",
  "message": "Missing token"
}
```

**Response Error (404):**
```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

#### `POST /users`
Create new user (registration).

**Request:**
```http
POST /users
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Response Success (201):**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "USER",
  "is_active": true
}
```

**Response Error (400):**
```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**Response Error (409):**
```json
{
  "error": "Conflict",
  "message": "Email already exists"
}
```

---

### **Health Check (`/health`)**

#### `GET /health`
Check server status and connections.

**Request:**
```http
GET /health
```

**Response Success (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-11-01T12:00:00.000Z",
  "uptime": 3600,
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}
```

**Response Error (503):**
```json
{
  "status": "error",
  "timestamp": "2025-11-01T12:00:00.000Z",
  "services": {
    "database": "error",
    "redis": "ok"
  }
}
```

---

## 📋 Data Schemas

### **UserBase**
```typescript
{
  name: string;     // 2-50 characters
  email: string;    // Valid email
  role: "USER" | "ADMIN";  // Default: "USER"
}
```

### **UserCreate**
```typescript
{
  name: string;
  email: string;
  role?: "USER" | "ADMIN";
  password: string; // 8-100 characters
}
```

### **UserRead**
```typescript
{
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  is_active: boolean;
}
```

### **UserLogin**
```typescript
{
  email: string;    // Valid email
  password: string; // No length validation
}
```

### **AuthTokens**
```typescript
{
  access_token: string;  // JWT valid for 24h
  refresh_token: string; // JWT valid for 7d
  expires_in: number;    // Seconds until expiration
}
```

---

## 🚨 Error Codes

| Code | Name | Description | When It Occurs |
|------|------|-------------|----------------|
| **200** | OK | Successful request | Operation completed |
| **201** | Created | Resource created | Successful POST |
| **400** | Bad Request | Invalid request | Incorrect input data |
| **401** | Unauthorized | Not authorized | Invalid/missing token |
| **403** | Forbidden | No permissions | Valid token but no permissions |
| **404** | Not Found | Resource not found | URL or resource doesn't exist |
| **409** | Conflict | Data conflict | Email already exists |
| **422** | Unprocessable Entity | Validation failed | Valid data but logically incorrect |
| **500** | Internal Server Error | Server error | Unexpected internal error |
| **503** | Service Unavailable | Service unavailable | DB disconnected, etc. |

---

## 📝 cURL Examples

### **Complete Login**
```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response: save the access_token
{
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

# 2. Use token to access protected endpoint
curl -X GET http://localhost:3000/users/me \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **User Registration**
```bash
curl -X POST http://localhost:3000/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "securePassword123"
  }'
```

### **Health Check**
```bash
curl -X GET http://localhost:3000/health
```

---

## 📄 JavaScript/TypeScript Examples

### **Client with Fetch API**
```typescript
class LabLinkClient {
  private baseURL = 'http://localhost:3000';
  private accessToken: string | null = null;

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.tokens.access_token;
    return data;
  }

  async getCurrentUser() {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.baseURL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get user: ${response.statusText}`);
    }

    return await response.json();
  }

  async createUser(userData: UserCreate) {
    const response = await fetch(`${this.baseURL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return await response.json();
  }
}

// Usage
const client = new LabLinkClient();

try {
  await client.login('user@example.com', 'password123');
  const user = await client.getCurrentUser();
  console.log('Current user:', user);
} catch (error) {
  console.error('Error:', error.message);
}
```

### **Client with Axios**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000
});

// Interceptor to add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try refresh
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh', {
          refresh_token: refreshToken
        });

        localStorage.setItem('accessToken', response.data.access_token);

        // Retry original request
        error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
        return api.request(error.config);
      } catch {
        // Refresh failed, redirect to login
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),

  getCurrentUser: () => api.get('/users/me'),

  createUser: (userData: UserCreate) =>
    api.post('/users', userData)
};
```

---

## 🔧 API Testing

### **Postman Collection**
```json
{
  "info": {
    "name": "LabLink API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/login",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\\n  \\"email\\": \\"user@example.com\\",\\n  \\"password\\": \\"password123\\"\\n}"
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 200) {",
              "  const response = pm.response.json();",
              "  pm.collectionVariables.set('accessToken', response.tokens.access_token);",
              "}"
            ]
          }
        }
      ]
    },
    {
      "name": "Get Current User",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/users/me",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}"
          }
        ]
      }
    }
  ]
}
```

---

## ➡️ Next Step

Continue with **Authentication & Security** to understand the JWT system and implemented security measures in depth.