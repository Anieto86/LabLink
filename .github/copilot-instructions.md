# LabLink (BioTrack) - AI Coding Agent Instructions

## Architecture Overview

This is a **modular Node.js API** with TypeScript, Express, and Drizzle ORM following a strict **layered architecture**:

- **Presentation Layer**: `src/modules/*/router.ts` - HTTP routes and request handling
- **Business Logic Layer**: `src/modules/*/service.ts` - Core business logic and validation
- **Data Access Layer**: `src/modules/*/repo.ts` - Database operations with Drizzle ORM
- **Infrastructure Layer**: `src/infra/` - External services, database, HTTP clients

## Key Development Patterns

### Module Structure

Each feature follows this **exact pattern** in `src/modules/[feature]/`:

```
feature/
├── feature.router.ts    # Express routes, middleware, request validation
├── feature.service.ts   # Business logic, orchestration, validation
└── feature.repo.ts      # Database queries using Drizzle ORM
```

### Database with Drizzle ORM

- **Schema**: Define tables in `src/infra/db/schema.ts` using Drizzle's schema API
- **Client**: Database connection and config in `src/infra/db/client.ts`
- **Migrations**: Use `pnpm db:gen` to generate, `pnpm db:migrate` to apply
- **Type Safety**: All queries are fully type-safe with TypeScript inference

### Configuration & Environment

- **Environment Variables**: Define and validate in `src/config/env.ts` using Zod schemas
- **Logger**: Configure Pino logger in `src/config/logger.ts` for structured logging
- **Database URL**: PostgreSQL connection string in `.env` file

### Error Handling & HTTP

- **Custom Errors**: Define in `src/common/http/errors.ts` extending base Error classes
- **Response Handlers**: Standardized responses in `src/common/http/handlers.ts`
- **HTTP Client**: Use Undici-based client in `src/infra/http/client.ts`

## Essential Commands

```bash
# Development workflow
pnpm dev                 # Start dev server with hot reload (tsx watch)
pnpm check              # Run format + lint + typecheck (always before committing)

# Database workflow
pnpm db:gen             # Generate migrations from schema changes
pnpm db:migrate         # Apply migrations to database
pnpm db:studio          # Open Drizzle Studio GUI

# Testing
pnpm test               # Run Vitest unit tests
pnpm test:watch         # Watch mode for TDD
```

## Project-Specific Conventions

### Code Quality Stack

- **Biome** (not ESLint/Prettier): Single tool for formatting, linting, and import sorting
- **Type Safety**: Strict TypeScript with `noEmit` checks via `pnpm typecheck`
- **Package Manager**: pnpm v10.11.0+ required (specified in package.json)

### Security & Middleware

- **Helmet**: Required for HTTP security headers
- **CORS**: Configurable cross-origin resource sharing
- **Validation**: Use Zod schemas for request validation, integrated with Drizzle via drizzle-zod

### Module Dependencies

- **Router** → **Service** → **Repository** (never skip layers)
- **Dependency Injection**: Inject services into routers, repositories into services
- **No Direct DB Access**: Routes must go through service layer, services through repository layer

## Implementation Guidelines

### When Adding New Features

1. Create module directory in `src/modules/[feature]/`
2. Implement repository first (data layer)
3. Build service layer (business logic)
4. Add router with proper middleware
5. Register routes in main app configuration

### Database Schema Changes

1. Modify `src/infra/db/schema.ts`
2. Run `pnpm db:gen` to generate migration
3. Review generated SQL in `drizzle/migrations/`
4. Apply with `pnpm db:migrate`

### Testing Strategy

- **Unit Tests**: Test services and repositories independently
- **E2E Tests**: Use Supertest in `src/test/e2e/` for API endpoint testing
- **Database Tests**: Mock or use test database instances

## Key Files Reference

- `src/server.ts` - Server entry point and Express app setup
- `src/infra/db/schema.ts` - Drizzle database schema definitions
- `src/config/env.ts` - Environment variable validation with Zod
- `package.json` - Note the `"type": "module"` for ES modules
- `drizzle.config.ts` - Drizzle ORM configuration for migrations

## OpenAPI Integration

- API documentation in `src/openapi/openapi.json`
- Keep OpenAPI spec synchronized with actual route implementations
- Consider using automated OpenAPI generation from route definitions
