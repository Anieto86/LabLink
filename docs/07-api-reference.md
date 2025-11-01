# API Reference

Esta documentación describe todos los endpoints disponibles en la API de LabLink, incluyendo esquemas de request/response y ejemplos.

## 🌐 Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## 🔐 Autenticación

LabLink utiliza **JWT (JSON Web Tokens)** para autenticación. La mayoría de endpoints requieren un token válido.

### **Header de Autenticación**
```http
Authorization: Bearer <your-jwt-token>
```

### **Flujo de Autenticación**
1. **Login** → Obtener access token (24h) y refresh token (7d)
2. **Usar access token** en requests a endpoints protegidos
3. **Refresh token** cuando access token expire

---

## 📡 Endpoints

### **Authentication (`/auth`)**

#### `POST /auth/login`
Autenticar usuario y obtener tokens JWT.

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
Renovar access token usando refresh token.

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
Obtener información del usuario autenticado.

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
Crear nuevo usuario (registro).

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
Verificar estado del servidor y conexiones.

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

## 📋 Esquemas de Datos

### **UserBase**
```typescript
{
  name: string;     // 2-50 caracteres
  email: string;    // Email válido
  role: "USER" | "ADMIN";  // Default: "USER"
}
```

### **UserCreate**
```typescript
{
  name: string;
  email: string;
  role?: "USER" | "ADMIN";
  password: string; // 8-100 caracteres
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
  email: string;    // Email válido
  password: string; // Sin validación de longitud
}
```

### **AuthTokens**
```typescript
{
  access_token: string;  // JWT válido por 24h
  refresh_token: string; // JWT válido por 7d
  expires_in: number;    // Segundos hasta expiración
}
```

---

## 🚨 Códigos de Error

| Código | Nombre | Descripción | Cuándo Ocurre |
|--------|--------|-------------|---------------|
| **200** | OK | Request exitoso | Operación completada |
| **201** | Created | Recurso creado | POST exitoso |
| **400** | Bad Request | Request inválido | Datos de entrada incorrectos |
| **401** | Unauthorized | No autorizado | Token inválido/faltante |
| **403** | Forbidden | Sin permisos | Token válido pero sin permisos |
| **404** | Not Found | Recurso no encontrado | URL o recurso inexistente |
| **409** | Conflict | Conflicto de datos | Email ya existe |
| **422** | Unprocessable Entity | Validación fallida | Datos válidos pero lógicamente incorrectos |
| **500** | Internal Server Error | Error del servidor | Error interno inesperado |
| **503** | Service Unavailable | Servicio no disponible | DB desconectada, etc. |

---

## 📝 Ejemplos con cURL

### **Login Completo**
```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response: guarda el access_token
{
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

# 2. Usar token para acceder a endpoint protegido
curl -X GET http://localhost:3000/users/me \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **Registro de Usuario**
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

## 📄 Ejemplos con JavaScript/TypeScript

### **Cliente con Fetch API**
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

// Uso
const client = new LabLinkClient();

try {
  await client.login('user@example.com', 'password123');
  const user = await client.getCurrentUser();
  console.log('Current user:', user);
} catch (error) {
  console.error('Error:', error.message);
}
```

### **Cliente con Axios**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, intentar refresh
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh', {
          refresh_token: refreshToken
        });

        localStorage.setItem('accessToken', response.data.access_token);

        // Reintentar request original
        error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
        return api.request(error.config);
      } catch {
        // Refresh falló, redirect a login
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Funciones helper
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

## 🔧 Testing de API

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

## ➡️ Siguiente Paso

Continúa con [**Autenticación y Seguridad**](./06-authentication.md) para entender en profundidad el sistema JWT y las medidas de seguridad implementadas.
