# Architecture & Patterns

This section explains LabLink's modular layered architecture and the design patterns used.

## 🏗️ General Architecture

LabLink follows a **modular layered architecture** with strict separation of responsibilities:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│                     (HTTP Interface)                       │
├─────────────────────────────────────────────────────────────┤
│  Router.ts  │  Router.ts  │  Router.ts  │  Router.ts      │
│  (Express)  │  (Express)  │  (Express)  │  (Express)      │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬───────────┘
       │             │             │             │
┌──────▼──────┬──────▼──────┬──────▼──────┬──────▼───────────┐
│                   BUSINESS LOGIC LAYER                     │
│                  (Domain & Validation)                     │
├─────────────────────────────────────────────────────────────┤
│ Service.ts  │ Service.ts  │ Service.ts  │ Service.ts      │
│ (Business)  │ (Business)  │ (Business)  │ (Business)      │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬───────────┘
       │             │             │             │
┌──────▼──────┬──────▼──────┬──────▼──────┬──────▼───────────┐
│                    DATA ACCESS LAYER                       │
│                   (Database Operations)                    │
├─────────────────────────────────────────────────────────────┤
│  Repo.ts    │  Repo.ts    │  Repo.ts    │  Repo.ts        │
│ (Drizzle)   │ (Drizzle)   │ (Drizzle)   │ (Drizzle)       │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬───────────┘
       │             │             │             │
       └─────────────┼─────────────┼─────────────┘
                     │             │
              ┌──────▼─────────────▼──────┐
              │    INFRASTRUCTURE LAYER   │
              │      (External Services)  │
              ├───────────────────────────┤
              │     PostgreSQL Database   │
              │     HTTP Clients          │
              │     JWT/Auth Services     │
              └───────────────────────────┘
```

## 📁 Directory Structure

```
src/
├── modules/                    # Business modules (features)
│   ├── auth/                  # Authentication module
│   │   ├── auth.router.ts     # HTTP routes (POST /login, /refresh)
│   │   ├── auth.service.ts    # JWT authentication logic
│   │   ├── auth.repo.ts       # User data access
│   │   ├── auth.dto.ts        # DTOs for request/response
│   │   └── requireAuth.ts     # Authorization middleware
│   │
│   ├── users/                 # Users module
│   │   ├── users.router.ts    # HTTP routes (GET /users/me, etc.)
│   │   ├── users.service.ts   # User business logic
│   │   ├── users.repo.ts      # Database queries
│   │   ├── users.dto.ts       # Validation schemas
│   │   └── users.mapper.ts    # DB ↔ DTOs mapping
│   │
│   └── health/                # Health checks module
│       └── health.router.ts   # GET /health endpoint
│
├── common/                    # Shared utilities
│   └── http/                  # Centralized HTTP handling
│       ├── errors.ts          # Custom error classes
│       └── handlers.ts        # Standardized HTTP responses
│
├── config/                    # Global configuration
│   ├── env.ts                 # Environment variable validation
│   └── logger.ts              # Pino logger configuration
│
├── infra/                     # External infrastructure
│   ├── db/                    # Database
│   │   ├── client.ts          # Drizzle client and connection
│   │   └── schema.ts          # Table definitions
│   │
│   └── http/                  # External HTTP clients
│       └── client.ts          # Undici HTTP client
│
├── test/                      # Tests organized by type
│   └── e2e/                   # End-to-end tests
│       └── *.e2e.test.ts      # Complete API tests
│
├── app.ts                     # Express app configuration
├── server.ts                  # Server entry point
└── index.ts                   # Main entry point
```

## 🔄 Data Flow by Layers

### 1. **Presentation Layer (Router)**
```typescript
// src/modules/users/users.router.ts
export const usersRouter = Router();

usersRouter.get("/users/me", requireAuth, async (req, res, next) => {
    try {
        const { id } = (req as any).user as { id: number };

        // ✅ Delegates to Service Layer
        const user = await UsersService.getUserById(id);

        res.json(user);
    } catch (error) {
        next(error);
    }
});
```

**Responsibilities:**
- ✅ HTTP route handling and middleware
- ✅ Header and authentication validation
- ✅ JSON response serialization
- ❌ **NO** business logic
- ❌ **NO** direct database access

### 2. **Business Logic Layer (Service)**
```typescript
// src/modules/users/users.service.ts
export class UsersService {
    static async getUserById(id: number): Promise<UserRead> {
        // ✅ Business validation
        if (!id || id <= 0) {
            throw new BadRequest("Invalid user ID");
        }

        // ✅ Delegates to Repository Layer
        const user = await UsersRepo.findById(id);

        if (!user || !user.isActive) {
            throw new NotFound("User not found");
        }

        // ✅ Data transformation
        return toUserRead(user);
    }
}
```

**Responsibilities:**
- ✅ Business logic and domain rules
- ✅ Input data validation
- ✅ Orchestration between repositories
- ✅ DTO transformation
- ❌ **NO** direct HTTP handling
- ❌ **NO** direct SQL queries

### 3. **Data Access Layer (Repository)**
```typescript
// src/modules/users/users.repo.ts
export class UsersRepo {
    static async findById(id: number): Promise<DbUser | undefined> {
        // ✅ Type-safe query with Drizzle
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id))
            .limit(1);

        return user;
    }

    static async createUser(data: UserCreate): Promise<DbUser> {
        const [newUser] = await db
            .insert(usersTable)
            .values(data)
            .returning();

        return newUser;
    }
}
```

**Responsibilities:**
- ✅ Database queries with Drizzle ORM
- ✅ Mapping between TS objects and SQL tables
- ✅ Database transactions
- ❌ **NO** business logic
- ❌ **NO** input validation

### 4. **Infrastructure Layer**
```typescript
// src/infra/db/client.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);
```

**Responsibilities:**
- ✅ External service connections
- ✅ Client configuration (DB, HTTP, etc.)
- ✅ Shared infrastructure

## 🎯 Design Patterns Used

### 1. **Module Pattern**
Each feature is a self-contained module:
```
auth/     # Everything related to authentication
users/    # Everything related to users
health/   # Everything related to health checks
```

### 2. **Repository Pattern**
Abstracts data access:
```typescript
// Implicit interface for all repos
class SomeRepo {
    static async findById(id: number) { }
    static async create(data: CreateType) { }
    static async update(id: number, data: UpdateType) { }
    static async delete(id: number) { }
}
```

### 3. **DTO Pattern (Data Transfer Objects)**
Clear contracts for API:
```typescript
// Input DTOs
export const userCreateSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8)
});

// Output DTOs
export const userReadSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.enum(["USER", "ADMIN"]),
    is_active: z.boolean()
});
```

### 4. **Middleware Pattern**
Cross-cutting functionalities:
```typescript
// Reusable authentication
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    // Verify JWT token
    // Inject user info into request
    // Continue or reject
}
```

### 5. **Error Handling Pattern**
Centralized error management:
```typescript
// Typed and consistent errors
export class BadRequest extends Error {
    public readonly statusCode = 400;
}

export class NotFound extends Error {
    public readonly statusCode = 404;
}
```

## 🔗 Dependencies Between Layers

### ✅ **Allowed Dependencies**
```
Router → Service → Repository → Infrastructure
```

### ❌ **Prohibited Dependencies**
```
Repository → Service  ❌
Router → Repository   ❌
Infrastructure → *    ❌
```

### 📋 **Architecture Rules**

1. **Single Responsibility**: Each layer has a specific responsibility
2. **Dependency Direction**: Dependencies go inward (towards infrastructure)
3. **No Skip Layers**: Each layer must use the next one, don't skip levels
4. **Type Safety**: All contracts are typed with TypeScript
5. **Testability**: Each layer is independently testable

## 🧪 Testing by Layers

```typescript
// Unit test for Service Layer
describe('UsersService', () => {
    it('should get user by id', async () => {
        // Mock Repository Layer
        jest.spyOn(UsersRepo, 'findById').mockResolvedValue(mockUser);

        const result = await UsersService.getUserById(1);

        expect(result).toEqual(expectedUserDTO);
    });
});

// E2E test for entire stack
describe('GET /users/me', () => {
    it('should return current user', async () => {
        const response = await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String)
        });
    });
});
```

---

## ➡️ Next Step

Continue with [**Development Guide**](./04-development.md) to learn the daily development workflow.
