# Lablink Node.js API

A modern Node.js API built with TypeScript, Express, and Drizzle ORM for biological data tracking and management.

📘 **Documentation:**
- 📖 [Complete Documentation](./docs/index.md) - Full project documentation
- 🌐 [API Documentation](http://localhost:3000/api-docs) - Swagger UI (when server is running)
- 🚀 [Contributing Guidelines](./docs/CONTRIBUTING.md) - How to contribute


## 🚀 Features

- **Modern TypeScript** - Built with TypeScript for type safety and better developer experience
- **Express.js** - Fast and minimalist web framework
- **Drizzle ORM** - Type-safe database operations with PostgreSQL
- **Modular Architecture** - Clean separation of concerns with modules for auth, users, health checks
- **Database Migrations** - Automated database schema management
- **Code Quality** - Integrated linting, formatting, and type checking with Biome
- **Testing** - Comprehensive test suite with Vitest and E2E tests
- **Security** - Enhanced security with Helmet middleware
- **CORS Support** - Cross-origin resource sharing configuration
- **Structured Logging** - Professional logging with Pino
- **Environment Configuration** - Secure environment variable management with validation
- **HTTP Client** - Built-in HTTP client utilities
- **Error Handling** - Centralized error handling and response formatting

## � Project Status

![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Tests](https://img.shields.io/badge/Tests-Setup-green)
![Documentation](https://img.shields.io/badge/Docs-Complete-green)
![API](https://img.shields.io/badge/API-Swagger-orange)

- ✅ **Infrastructure**: TypeScript, Drizzle ORM, PostgreSQL
- ✅ **Authentication**: JWT-based auth system
- ✅ **Documentation**: Complete API docs with Swagger UI
- ✅ **Testing**: Vitest setup with CI/CD
- ✅ **Development Tools**: Obsidian integration, Warp workflows
- 🔲 **Core Features**: Laboratory management (in progress)

## �📋 Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.11.0 or higher)
- PostgreSQL database

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd biotrack-node
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and configure your database connection:
```
DATABASE_URL="postgresql://username:password@localhost:5432/biotrack"
```

Additionally, the project uses JWTs for authentication. Add a secret key for signing tokens:
```
# Secret used to sign JWTs (keep this secret and do NOT commit to version control)
SECRET_KEY="your-long-random-secret-here"
```

The project uses the `jose` library for JSON Web Token (JWT) creation and verification (server-side).

4. Set up the database:
```bash
# Generate database migrations from schema
pnpm db:gen

# Apply migrations to database
pnpm db:migrate
```

## 🚀 Usage

### Development

Start the development server with hot reload:
```bash
pnpm dev
```

The API will be available at `http://localhost:3000` (or your configured port).

### Production

Build and start the production server:
```bash
pnpm build
pnpm start
```

### Database Operations

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

## 🧪 Testing

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch
```

The project includes:
- **Unit tests** for individual modules and services
- **E2E tests** for API endpoints using Supertest
- **Test utilities** for database and HTTP mocking

## 🔧 Development Tools

### Code Quality

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Check code (format + lint + typecheck)
pnpm check

# Type checking
pnpm typecheck
```

## 📁 Project Structure

```
LabLink-node/
├── src/                    # Source code
│   ├── app.ts             # Express application setup
│   ├── server.ts          # Server entry point
│   ├── index.ts           # Main application entry point
│   ├── config/            # Configuration management
│   │   ├── env.ts         # Environment variables validation
│   │   └── logger.ts      # Logger configuration
│   ├── common/            # Shared utilities and types
│   │   └── http/          # HTTP utilities and error handling
│   │       ├── errors.ts  # Custom error classes
│   │       └── handlers.ts # HTTP response handlers
│   ├── infra/             # Infrastructure layer
│   │   ├── db/            # Database configuration and schema
│   │   │   ├── client.ts  # Database client setup
│   │   │   └── schema.ts  # Drizzle database schema
│   │   └── http/          # HTTP client utilities
│   │       └── client.ts  # HTTP client configuration
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication module
│   │   │   ├── auth.router.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.repo.ts
│   │   ├── users/         # Users module
│   │   │   └── users.router.ts
│   │   └── health/        # Health check module
│   │       └── health.router.ts
│   ├── openapi/           # OpenAPI/Swagger documentation
│   └── test/              # Test files
│       └── e2e/           # End-to-end tests
├── drizzle/               # Drizzle migrations (auto-generated)
├── dist/                  # Compiled JavaScript (production build)
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── biome.json            # Biome configuration (linting & formatting)
├── drizzle.config.ts     # Drizzle ORM configuration
└── README.md             # Project documentation
```

## 🗄️ Database

This project uses PostgreSQL with Drizzle ORM for type-safe database operations. The database schema is defined in TypeScript using Drizzle's schema definition API, and migrations are managed in the `drizzle/` directory.

### Key Features:
- **Type-safe queries** with Drizzle ORM
- **SQL-like query builder** with full TypeScript support
- **Automatic migration generation** from schema changes
- **Database introspection** for existing databases
- **Drizzle Studio** - built-in GUI for database management
- **Zero runtime overhead** - migrations and schema are compile-time only
- **Schema validation** with Zod integration via drizzle-zod

### Architecture:
- **Database client** (`src/infra/db/client.ts`) - Connection and configuration
- **Schema definitions** (`src/infra/db/schema.ts`) - Table definitions and relationships
- **Repository pattern** - Data access layer in module repositories

## 🏗️ Architecture

This project follows a modular, layered architecture with clear separation of concerns:

### Layers:
1. **Presentation Layer** (`src/modules/*/router.ts`) - HTTP routes and request handling
2. **Business Logic Layer** (`src/modules/*/service.ts`) - Core business logic and validation
3. **Data Access Layer** (`src/modules/*/repo.ts`) - Database operations and queries
4. **Infrastructure Layer** (`src/infra/`) - External services, database, HTTP clients

### Key Patterns:
- **Module-based organization** - Each feature is self-contained with its own router, service, and repository
- **Dependency injection** - Services and repositories are injected into routers
- **Error handling** - Centralized error handling with custom error types
- **Configuration management** - Environment variables with validation
- **Logging** - Structured logging throughout the application

## 📦 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Schema Validation**: Zod + Drizzle-Zod
- **Testing**: Vitest + Supertest (E2E)
- **Code Quality**: Biome
- **Package Manager**: pnpm
- **HTTP Client**: Undici
- **Logging**: Pino

## 🔒 Security

- **Helmet**: Security headers middleware for HTTP security
- **CORS**: Configurable cross-origin resource sharing
- **Environment Variables**: Secure configuration management with validation
- **Input Validation**: Request validation using Zod schemas
- **Error Sanitization**: Secure error responses without sensitive information

## 📝 Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm db:gen` | Generate migrations from schema changes |
| `pnpm db:migrate` | Apply migrations to database |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm db:pull` | Introspect database to generate schema |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Lint code with Biome |
| `pnpm check` | Run all code quality checks |
| `pnpm typecheck` | Type check without emitting files |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests and quality checks: `pnpm check && pnpm test`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Issues & Support

If you encounter any issues or need support, please create an issue in the repository's issue tracker.
# LabLink
