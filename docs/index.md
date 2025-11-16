# LabLink API Documentation

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests  
pnpm test
```

## API Endpoints
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## Development Guide
- [**Contributing**](CONTRIBUTING.md) - How to contribute to the project

## Architecture
- **TypeScript** + Express + Drizzle ORM
- **PostgreSQL** database
- **Modular architecture** with layered approach
- **Schema → DTOs → Mapper → Repository → Router**
