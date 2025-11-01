# Overview - LabLink (BioTrack)

## What is LabLink?

LabLink is a **modern API for biological data tracking and management**, built with Node.js, TypeScript, and a scalable modular architecture. The project is designed for laboratories and research centers that need to manage biological data securely and efficiently.

## 🎯 Project Goals

- **Biological Data Management**: Efficient storage and querying of laboratory data
- **Security**: Robust JWT authentication with granular access control
- **Scalability**: Modular architecture that allows easy addition of new features
- **Type Safety**: TypeScript throughout the stack to prevent runtime errors
- **Developer Experience**: Modern tools for agile and reliable development

## 🚀 Key Features

### ✅ **Modern Architecture**
- **TypeScript First**: Type safety throughout the application
- **Modular**: Each feature is independent and testable
- **Layered Architecture**: Clear separation between layers (Router → Service → Repository)
- **ES Modules**: Modern import syntax

### ✅ **Type-Safe Database**
- **Drizzle ORM**: Type-safe queries with SQL-like syntax
- **PostgreSQL**: Robust database for critical data
- **Migrations**: Automatic schema version control
- **Drizzle Studio**: Integrated GUI for administration

### ✅ **Authentication & Security**
- **JWT Tokens**: Stateless authentication with `jose` library
- **Bcrypt**: Secure password hashing
- **Helmet**: Automatic HTTP security headers
- **CORS**: Configurable cross-origin access control

### ✅ **Quality Assurance**
- **Biome**: Linting, formatting and optimization in one tool
- **Vitest**: Fast and modern testing framework
- **E2E Testing**: Integration tests with Supertest
- **Type Checking**: Strict TypeScript validation

### ✅ **Developer Experience**
- **Hot Reload**: Development with automatic reload (tsx watch)
- **pnpm**: Fast and efficient package manager
- **Structured Logging**: Professional logs with Pino
- **Environment Validation**: Variable validation with Zod

## 🏗️ Tech Stack

| Category | Technology | Purpose |
|-----------|------------|-----------|
| **Runtime** | Node.js 18+ | JavaScript server |
| **Language** | TypeScript | Type safety and developer experience |
| **Framework** | Express.js 5 | REST API framework |
| **Database** | PostgreSQL | Relational database |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **Validation** | Zod | Runtime schema validation |
| **Authentication** | Jose (JWT) | JSON Web Tokens |
| **Password Hashing** | bcrypt | Secure password hashing |
| **Testing** | Vitest + Supertest | Unit & E2E testing |
| **Code Quality** | Biome | Linting, formatting, imports |
| **Package Manager** | pnpm | Fast dependency management |
| **Logging** | Pino | Structured logging |

## 🎨 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Admin Panel   │    │   Mobile App    │
│   (Frontend)    │    │   (Dashboard)   │    │   (React Native)│
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      LabLink API          │
                    │   (Express + TypeScript)  │
                    └─────────────┬─────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
        ┌───────▼───────┐ ┌──────▼──────┐ ┌──────▼──────┐
        │   Auth        │ │   Users     │ │   Health    │
        │   Module      │ │   Module    │ │   Module    │
        └───────────────┘ └─────────────┘ └─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      PostgreSQL           │
                    │   (Drizzle ORM)          │
                    └───────────────────────────┘
```

## 🔄 Typical Data Flow

1. **Request**: Client sends HTTP request to endpoint
2. **Router**: Express router captures request and validates headers/auth
3. **Middleware**: `requireAuth` verifies JWT and extracts user info
4. **Service**: Business logic processes the request
5. **Repository**: Data access via Drizzle ORM queries
6. **Database**: PostgreSQL executes query and returns data
7. **Response**: Data is mapped to DTOs and sent as JSON

## 🚦 Project Status

| Module | Status | Description |
|--------|--------|-------------|
| **Auth** | ✅ Implemented | JWT authentication, login, token refresh |
| **Users** | ✅ Implemented | User management, profiles, roles |
| **Health** | ✅ Implemented | Health check endpoints |
| **Database** | ✅ Implemented | Schema, migrations, Drizzle setup |
| **Testing** | 🟡 Partial | Basic unit tests, E2E in development |
| **Documentation** | 🟡 In progress | Wiki and API docs |
| **CI/CD** | ❌ Pending | GitHub Actions, automated testing |
| **Docker** | ❌ Pending | Containerization for deployment |

---

## ➡️ Next Step

Continue with the [**Quick Start Guide**](./02-quick-start.md) to set up your development environment.
