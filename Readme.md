# LabLink - Laboratory Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1.svg?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)
[![CI](https://github.com/Anieto86/LabLink/workflows/CI/badge.svg)](https://github.com/Anieto86/LabLink/actions)

> **Modern TypeScript API for laboratory management with Express + Drizzle ORM**

## ��� Quick Start

```bash
# Install dependencies
pnpm install

# Setup database
pnpm db:migrate

# Start development
pnpm dev
```

## 📚 Documentation

- **[Contributing Guidelines](docs/CONTRIBUTING.md)** - How to contribute
- **[API Documentation](docs/index.md)** - Complete API reference

## ���️ Architecture

- **TypeScript** + Express.js
- **Drizzle ORM** + PostgreSQL
- **Modular layered architecture**
- **JWT Authentication**
- **Zod validation**

## ��� Features

- User management
- Laboratory equipment tracking
- Authentication & authorization
- RESTful API design
- Type-safe database operations

## 🚀 Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm check            # Run format + lint + typecheck

# Database
pnpm db:gen           # Generate migrations
pnpm db:migrate       # Apply migrations
pnpm db:studio        # Open Drizzle Studio

# Documentation
pnpm sync:obsidian    # Sync personal docs to Obsidian
pnpm docs:serve       # Show GitHub Pages URL
```

## 📊 Project Status

- ✅ **Authentication** - JWT-based auth system
- ✅ **User Management** - Complete CRUD operations
- 🚧 **Equipment Tracking** - In development
- 📋 **Laboratory Management** - Planned
- 📈 **Analytics Dashboard** - Future feature

---

*Built for efficient laboratory management with modern TypeScript best practices.*
