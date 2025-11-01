# Development Guide

This guide covers daily development workflow, tools, commands, and best practices.

## 🛠️ Development Environment Setup

### **VS Code (Recommended)**

#### Essential Extensions:
```json
// .vscode/extensions.json
{
  "recommendations": [
    "biomejs.biome",              // Linting and formatting
    "bradlc.vscode-tailwindcss",  // TypeScript IntelliSense
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "PostgreSQL.vscode-postgresql"
  ]
}
```

#### VS Code Configuration:
```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### **Terminal Configuration**

#### Useful Aliases:
```bash
# .bashrc or .zshrc
alias ll="ls -la"
alias pn="pnpm"
alias pd="pnpm dev"
alias pt="pnpm test"
alias pc="pnpm check"
alias pb="pnpm build"

# Frequent DB commands
alias dbgen="pnpm db:gen"
alias dbmig="pnpm db:migrate"
alias dbstudio="pnpm db:studio"
```

## ⚡ Daily Development Workflow

### **1. Start of Day**
```bash
# Update dependencies
pnpm install

# Check DB status
pnpm db:studio

# Run tests to verify everything is OK
pnpm test

# Start development
pnpm dev
```

### **2. Feature Development**
```bash
# Create feature branch
git checkout -b feature/new-functionality

# Iterative development with hot reload
pnpm dev

# Check code quality frequently
pnpm check
```

### **3. Before Commit**
```bash
# Check everything before commit
pnpm check      # Format + lint + typecheck
pnpm test       # Run tests
pnpm build      # Verify build works
```

### **4. Continuous Testing**
```bash
# Tests in watch mode during development
pnpm test:watch

# Only tests for specific module
pnpm test auth

# Tests with coverage
pnpm test --coverage
```

## 📋 Main Commands

### **Development**
| Command | Description | When to Use |
|---------|-------------|-------------|
| `pnpm dev` | Server with hot reload | Active development |
| `pnpm build` | Production build | Before deploy |
| `pnpm start` | Production server | Production testing |
| `pnpm check` | Format + lint + types | Before each commit |

### **Database**
| Command | Description | When to Use |
|---------|-------------|-------------|
| `pnpm db:gen` | Generate migrations | After changing schema |
| `pnpm db:migrate` | Apply migrations | After generating |
| `pnpm db:studio` | Database GUI | Inspect data |
| `pnpm db:pull` | Introspect DB | Sync existing schema |

### **Testing**
| Command | Description | When to Use |
|---------|-------------|-------------|
| `pnpm test` | Run all tests | CI/CD and verification |
| `pnpm test:watch` | Tests in watch mode | TDD development |
| `pnpm test auth` | Specific module tests | Focused testing |

### **Code Quality**
| Command | Description | When to Use |
|---------|-------------|-------------|
| `pnpm format` | Format code | Auto on save (VS Code) |
| `pnpm lint` | Linting without fix | CI/CD |
| `pnpm typecheck` | Check TS types | CI/CD and pre-commit |

## 🏗️ Adding New Feature

### **1. Create Module Structure**
```bash
mkdir src/modules/new-feature
cd src/modules/new-feature

# Create base files
touch new-feature.router.ts
touch new-feature.service.ts
touch new-feature.repo.ts
touch new-feature.dto.ts
touch new-feature.mapper.ts
```

### **2. Router Template**
```typescript
// new-feature.router.ts
import { Router } from "express";
import { requireAuth } from "../auth/requireAuth";
import { NewFeatureService } from "./new-feature.service";

export const newFeatureRouter = Router();

newFeatureRouter.get("/new-feature", requireAuth, async (req, res, next) => {
    try {
        const result = await NewFeatureService.getAll();
        res.json(result);
    } catch (error) {
        next(error);
    }
});
```

### **3. Service Template**
```typescript
// new-feature.service.ts
import { NewFeatureRepo } from "./new-feature.repo";
import { NotFound } from "../../common/http/errors";

export class NewFeatureService {
    static async getAll() {
        const items = await NewFeatureRepo.findAll();
        return items;
    }

    static async getById(id: number) {
        const item = await NewFeatureRepo.findById(id);
        if (!item) {
            throw new NotFound("Item not found");
        }
        return item;
    }
}
```

### **4. Repository Template**
```typescript
// new-feature.repo.ts
import { db } from "../../infra/db/client";
import { newFeatureTable } from "../../infra/db/schema";
import { eq } from "drizzle-orm";

export class NewFeatureRepo {
    static async findAll() {
        return await db.select().from(newFeatureTable);
    }

    static async findById(id: number) {
        const [item] = await db
            .select()
            .from(newFeatureTable)
            .where(eq(newFeatureTable.id, id))
            .limit(1);
        return item;
    }
}
```

### **5. Add to DB Schema**
```typescript
// src/infra/db/schema.ts
export const newFeatureTable = pgTable("new_feature", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});
```

### **6. Register Router**
```typescript
// src/app.ts (or where you register routes)
import { newFeatureRouter } from "./modules/new-feature/new-feature.router";

app.use("/api", newFeatureRouter);
```

### **7. Generate and Apply Migration**
```bash
pnpm db:gen
pnpm db:migrate
```

## 🧪 Testing Strategy

### **Test Structure**
```
src/test/
├── unit/                      # Unit tests
│   ├── services/             # Service tests
│   └── repositories/         # Repository tests
├── integration/              # Integration tests
│   └── modules/              # Complete module tests
└── e2e/                      # End-to-end tests
    └── *.e2e.test.ts         # Complete API tests
```

### **Unit Test - Service**
```typescript
// src/test/unit/services/users.service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { UsersService } from '../../../modules/users/users.service';
import { UsersRepo } from '../../../modules/users/users.repo';

// Mock the repository
vi.mock('../../../modules/users/users.repo');

describe('UsersService', () => {
    it('should get user by id', async () => {
        // Arrange
        const mockUser = { id: 1, name: 'Test User', email: 'test@test.com' };
        vi.spyOn(UsersRepo, 'findById').mockResolvedValue(mockUser);

        // Act
        const result = await UsersService.getUserById(1);

        // Assert
        expect(result).toEqual(mockUser);
        expect(UsersRepo.findById).toHaveBeenCalledWith(1);
    });
});
```

### **E2E Test - API**
```typescript
// src/test/e2e/users.e2e.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app';

describe('Users API', () => {
    let authToken: string;

    beforeAll(async () => {
        // Setup: create user and get token
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email: 'test@test.com', password: 'password123' });

        authToken = loginResponse.body.token;
    });

    it('GET /users/me should return current user', async () => {
        const response = await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            email: 'test@test.com',
            name: expect.any(String)
        });
    });
});
```

## 🐛 Debugging

### **VS Code Debugging**
```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug LabLink",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/src/server.ts",
            "runtimeExecutable": "pnpm",
            "runtimeArgs": ["dev"],
            "env": {
                "NODE_ENV": "development"
            },
            "console": "integratedTerminal",
            "skipFiles": ["<node_internals>/**"]
        }
    ]
}
```

### **Logging for Debug**
```typescript
// Use structured logger
import { logger } from "../../config/logger";

export class SomeService {
    static async someMethod(data: any) {
        logger.info({ data }, 'Processing request');

        try {
            const result = await SomeRepo.process(data);
            logger.info({ result }, 'Request processed successfully');
            return result;
        } catch (error) {
            logger.error({ error, data }, 'Failed to process request');
            throw error;
        }
    }
}
```

### **Database Debugging**
```typescript
// Enable query logging in development
// src/infra/db/client.ts
const client = postgres(env.DATABASE_URL, {
    debug: env.NODE_ENV === 'development' // Log SQL queries
});
```

## 📊 Performance Tips

### **Database Queries**
```typescript
// ✅ GOOD: Specific select
const users = await db
    .select({ id: usersTable.id, name: usersTable.name })
    .from(usersTable);

// ❌ BAD: Select *
const users = await db.select().from(usersTable);

// ✅ GOOD: Use limits
const users = await db
    .select()
    .from(usersTable)
    .limit(10);

// ✅ GOOD: Indexes on where clauses
const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id)) // id is indexed
    .limit(1);
```

### **Memory Management**
```typescript
// ✅ GOOD: Streaming for large datasets
async function* getUsersStream() {
    const users = await db.select().from(usersTable);
    for (const user of users) {
        yield user;
    }
}

// ✅ GOOD: Pagination
async function getUsers(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    return await db
        .select()
        .from(usersTable)
        .limit(limit)
        .offset(offset);
}
```

---

## ➡️ Next Step

Continue with [**Database**](./05-database.md) to learn about schemas, migrations, and Drizzle ORM.
