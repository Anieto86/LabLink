# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Development Workflow
```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Code Quality
```bash
# Run all code quality checks (format + lint + typecheck)
pnpm check

# Individual checks
pnpm format      # Format code with Biome
pnpm lint        # Lint code with Biome  
pnpm typecheck   # Type check without emitting files
```

### Testing
```bash
# Run all tests once
pnpm test

# Run tests in watch mode (for TDD)
pnpm test:watch
```

### Database Operations (Drizzle ORM)
```bash
# Generate new migrations from schema changes
pnpm db:gen

# Apply migrations to database
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Introspect existing database to generate schema
pnpm db:pull
```

## Project Architecture

### Tech Stack
- **Runtime**: Node.js (v18+) with TypeScript
- **Framework**: Express.js v5
- **Database**: PostgreSQL with Drizzle ORM
- **Package Manager**: pnpm (v10.11.0+)
- **Code Quality**: Biome (formatting, linting)
- **Testing**: Vitest with Supertest for E2E
- **Logging**: Pino structured logging
- **HTTP Client**: Undici
- **Schema Validation**: Zod with drizzle-zod

### Modular Architecture Pattern

The codebase follows a **modular, layered architecture** with clear separation of concerns:

#### Layer Structure
1. **Presentation Layer** (`src/modules/*/router.ts`) - HTTP routes and request handling
2. **Business Logic Layer** (`src/modules/*/service.ts`) - Core business logic and validation  
3. **Data Access Layer** (`src/modules/*/repo.ts`) - Database operations and queries
4. **Infrastructure Layer** (`src/infra/`) - External services, database, HTTP clients

#### Module Organization
Each feature module is self-contained with:
- `*.router.ts` - Express routes and middleware
- `*.service.ts` - Business logic and validation
- `*.repo.ts` - Database operations using Drizzle ORM

#### Key Directories
- `src/config/` - Environment variables and logger configuration
- `src/common/http/` - Shared HTTP utilities and error handling
- `src/infra/db/` - Database client and schema definitions
- `src/modules/` - Feature modules (auth, users, health)
- `src/test/e2e/` - End-to-end tests with Supertest

### Database Architecture (Drizzle ORM)
- **Type-safe queries** with full TypeScript support
- **Schema definitions** in `src/infra/db/schema.ts` using Drizzle's schema API
- **Repository pattern** for data access abstraction
- **Zero runtime overhead** - compile-time only migrations
- **Zod integration** via drizzle-zod for validation

### Development Patterns
- **Dependency injection** - Services and repositories injected into routers
- **Centralized error handling** with custom error types in `src/common/http/errors.ts`
- **Environment validation** using Zod schemas in `src/config/env.ts`
- **Structured logging** with Pino throughout the application

## Environment Setup

Required environment variables (copy `.env.example` to `.env`):
- `DATABASE_URL` - PostgreSQL connection string

## Development Notes

- This project uses **pnpm** as the package manager - always use pnpm commands
- **ES modules** are enabled (`"type": "module"` in package.json)
- **Biome** handles both linting and formatting - no need for separate ESLint/Prettier
- **Vitest** is the test runner - supports watch mode for TDD
- **Express v5** is used (note: different from v4 in some middleware patterns)
- **Drizzle Studio** provides a web GUI for database management