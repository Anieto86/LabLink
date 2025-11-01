# Quick Start Guide.

This guide will help you get LabLink running on your machine in less than 10 minutes.

## 📋 Prerequisites

Before starting, make sure you have installed:

### ✅ **Required Software**
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **pnpm** v10.20.0 or higher ([Install](https://pnpm.io/installation))
- **PostgreSQL** v12 or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

### ✅ **Recommended Tools**
- **VS Code** with TypeScript and Biome extensions
- **DBeaver** or **pgAdmin** to manage PostgreSQL
- **Postman** or **Insomnia** to test the API

### ✅ **Verify Installation**
```bash
# Check versions
node --version    # Should be v18+
pnpm --version    # Should be v10.20.0+
psql --version    # Should be v12+
git --version
```

## 🚀 Step-by-Step Installation

### 1. **Clone Repository**
```bash
git clone https://github.com/Anieto86/LabLink.git
cd LabLink
```

### 2. **Install Dependencies**
```bash
# Install all project dependencies
pnpm install
```

### 3. **Configure Database**

#### Create PostgreSQL Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE biotrack_db;

# Create user (optional)
CREATE USER lablink_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE biotrack_db TO lablink_user;

# Exit
\q
```

### 4. **Configure Environment Variables**

```bash
# Copy example file
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database connection
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/biotrack_db"

# JWT Secret (generate a secure one)
SECRET_KEY="your-super-secret-jwt-key-here-make-it-long-and-random"

# Server configuration
PORT=3000
NODE_ENV=development
```

### 5. **Run Migrations**
```bash
# Generate migrations from schema
pnpm db:gen

# Apply migrations to database
pnpm db:migrate
```

### 6. **Start Development Server**
```bash
# Start with hot reload
pnpm dev
```

Done! The server should be running at `http://localhost:3000`

## ✅ Verify Installation

### 1. **Health Check**
```bash
curl http://localhost:3000/health
```
**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-01T12:00:00.000Z"
}
```

### 2. **Verify Database**
```bash
# Open Drizzle Studio (GUI for DB)
pnpm db:studio
```
Opens at `https://local.drizzle.studio`

### 3. **Run Tests**
```bash
# Run test suite
pnpm test
```

## 📊 Next Steps

### 🔐 **Test Authentication**
1. Create a user using the API
2. Login and get JWT token
3. Use token to access protected endpoints

### 📡 **Explore API**
- Review available endpoints in [API Reference](./07-api-reference.md)
- Test with Postman/Insomnia
- Review request/response schemas

### 🏗️ **Understand Architecture**
- Read [Architecture & Patterns](./03-architecture.md)
- Explore code in `src/modules/`
- Review data flow

## 🐛 Troubleshooting

### ❌ **Error: "Cannot connect to database"**
- Verify PostgreSQL is running
- Check credentials in `.env`
- Verify `biotrack_db` database exists

### ❌ **Error: "Port 3000 already in use"**
```bash
# Change port in .env
PORT=3001

# Or kill process on port 3000
npx kill-port 3000
```

### ❌ **Error: "Secret key not found"**
- Verify `SECRET_KEY` is defined in `.env`
- Generate new secret key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ❌ **Error: "Migration failed"**
```bash
# Clean and regenerate migrations
rm -rf drizzle/migrations/*
pnpm db:gen
pnpm db:migrate
```

## 📝 Useful Commands

```bash
# Development
pnpm dev              # Server with hot reload
pnpm build            # Production build
pnpm start            # Production server

# Database
pnpm db:gen           # Generate migrations
pnpm db:migrate       # Apply migrations
pnpm db:studio        # Open database GUI
pnpm db:pull          # Introspect existing DB

# Code quality
pnpm check            # Format + lint + typecheck
pnpm format           # Format code
pnpm lint             # Linting
pnpm typecheck        # Type checking

# Testing
pnpm test             # Run tests
pnpm test:watch       # Tests in watch mode
```

---

## ➡️ Next Step

Now that you have LabLink running, continue with [**Architecture & Patterns**](./03-architecture.md) to understand how the project is structured.
