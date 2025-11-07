# Contributing to LabLink

Thank you for your interest in contributing to LabLink! This document provides guidelines and instructions for contributing to the project.

## 🚀 Development Setup

### Prerequisites
- Node.js (v18+)
- pnpm (v10.11.0+)
- PostgreSQL
- Git

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/Anieto86/LabLink.git
cd LabLink-node

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

## 📋 Development Workflow

### Before Starting
1. **Create a new branch** from `main`
2. **Follow naming convention**: `feature/feature-name` or `fix/bug-description`

### Development Process
```bash
# Start development
pnpm dev

# Run tests
pnpm test:watch

# Check code quality
pnpm check

# Sync with Obsidian (for study/documentation)
pnpm obsidian:sync
```

### Before Committing
1. **Run full checks**: `pnpm check`
2. **Run tests**: `pnpm test`
3. **Update documentation** if needed
4. **Write meaningful commit messages**

## 🏗️ Project Structure

```
src/
├── modules/           # Feature modules (auth, users, etc.)
│   └── [module]/
│       ├── *.router.ts    # HTTP routes
│       ├── *.service.ts   # Business logic
│       └── *.repo.ts      # Database operations
├── infra/             # Infrastructure (database, HTTP client)
├── config/            # Configuration (env, logger)
├── common/            # Shared utilities
└── test/              # Test files
```

## 🧪 Testing Guidelines

- **Unit Tests**: Test individual functions/methods
- **Integration Tests**: Test module interactions
- **E2E Tests**: Test complete API flows
- **Coverage**: Aim for >80% code coverage

### Test Commands
```bash
pnpm test              # Run all tests
pnpm test:watch        # TDD mode
pnpm test:coverage     # With coverage report
```

## 📝 Code Style

We use **Biome** for consistent code formatting and linting:

```bash
pnpm format    # Format code
pnpm lint      # Check linting rules
pnpm check     # Format + lint + typecheck
```

### TypeScript Guidelines
- Use **strict mode** (already configured)
- Prefer **explicit types** for public APIs
- Use **type imports** when possible
- Follow **existing patterns** in the codebase

## 🎯 Module Development Pattern

When adding new features, follow this pattern:

1. **Router** (`*.router.ts`): HTTP endpoints and middleware
2. **Service** (`*.service.ts`): Business logic and validation
3. **Repository** (`*.repo.ts`): Database operations
4. **DTOs** (`*.dto.ts`): Data transfer objects with validation
5. **Tests**: Unit and integration tests

Example:
```typescript
// users.router.ts
app.get('/users', UsersController.getUsers);

// users.service.ts (Business logic)
export class UsersService {
  static async getUsers() {
    return UsersRepo.findAll();
  }
}

// users.repo.ts (Database)
export class UsersRepo {
  static async findAll() {
    return db.select().from(users);
  }
}
```

## 📖 Documentation

- **API Documentation**: Auto-generated with OpenAPI/Swagger
- **Code Comments**: For complex business logic
- **README Updates**: For new features or setup changes
- **Obsidian Integration**: Use templates for study and analysis

## 🔄 Pull Request Process

1. **Create feature branch** from `main`
2. **Implement changes** following guidelines
3. **Add/update tests** for new functionality
4. **Update documentation** if needed
5. **Ensure all checks pass**:
   ```bash
   pnpm check
   pnpm test
   ```
6. **Create PR** with clear description
7. **Respond to review feedback**

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for functionality
- [ ] Manual testing completed

## Documentation
- [ ] Updated README if needed
- [ ] Updated API documentation
- [ ] Added inline comments for complex logic
```

## 🐛 Bug Reports

When reporting bugs, please include:
- **Environment**: OS, Node.js version, pnpm version
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Error messages** (if any)
- **Screenshots** (if applicable)

## 💡 Feature Requests

For new features:
- **Use case**: Why is this needed?
- **Proposed solution**: How should it work?
- **Alternatives considered**
- **Additional context**

## 🚀 Deployment

The project uses CI/CD with GitHub Actions:
- **Tests** run automatically on PRs
- **Type checking** and linting enforced
- **Deployment** happens on merge to `main`

## 📞 Getting Help

- **Documentation**: Check `docs/` directory
- **API Reference**: `http://localhost:3000/api-docs`
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions for questions

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project documentation
- Release notes

Thank you for contributing to LabLink! 🧬✨
