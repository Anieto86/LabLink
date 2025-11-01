# Guía de Desarrollo

Esta guía cubre el workflow diario de desarrollo, herramientas, comandos y mejores prácticas.

## 🛠️ Setup del Entorno de Desarrollo

### **VS Code (Recomendado)**

#### Extensiones Esenciales:
```json
// .vscode/extensions.json
{
  "recommendations": [
    "biomejs.biome",              // Linting y formatting
    "bradlc.vscode-tailwindcss",  // TypeScript IntelliSense
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "PostgreSQL.vscode-postgresql"
  ]
}
```

#### Configuración de VS Code:
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

### **Configuración de Terminal**

#### Aliases Útiles:
```bash
# .bashrc o .zshrc
alias ll="ls -la"
alias pn="pnpm"
alias pd="pnpm dev"
alias pt="pnpm test"
alias pc="pnpm check"
alias pb="pnpm build"

# Comandos de DB frecuentes
alias dbgen="pnpm db:gen"
alias dbmig="pnpm db:migrate"
alias dbstudio="pnpm db:studio"
```

## ⚡ Workflow de Desarrollo Diario

### **1. Arranque del Día**
```bash
# Actualizar dependencias
pnpm install

# Verificar estado de la DB
pnpm db:studio

# Ejecutar tests para verificar que todo está OK
pnpm test

# Iniciar desarrollo
pnpm dev
```

### **2. Desarrollo de Feature**
```bash
# Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# Desarrollo iterativo con hot reload
pnpm dev

# Verificar calidad de código frecuentemente
pnpm check
```

### **3. Antes de Commit**
```bash
# Verificar todo antes de commit
pnpm check      # Format + lint + typecheck
pnpm test       # Ejecutar tests
pnpm build      # Verificar que build funciona
```

### **4. Testing Continuo**
```bash
# Tests en modo watch durante desarrollo
pnpm test:watch

# Solo tests de un módulo específico
pnpm test auth

# Tests con coverage
pnpm test --coverage
```

## 📋 Comandos Principales

### **Desarrollo**
| Comando | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| `pnpm dev` | Servidor con hot reload | Desarrollo activo |
| `pnpm build` | Build para producción | Antes de deploy |
| `pnpm start` | Servidor de producción | Testing de producción |
| `pnpm check` | Format + lint + types | Antes de cada commit |

### **Base de Datos**
| Comando | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| `pnpm db:gen` | Generar migraciones | Después de cambiar schema |
| `pnpm db:migrate` | Aplicar migraciones | Después de generar |
| `pnpm db:studio` | GUI de base de datos | Inspeccionar datos |
| `pnpm db:pull` | Introspeccionar DB | Sincronizar schema existente |

### **Testing**
| Comando | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| `pnpm test` | Ejecutar todos los tests | CI/CD y verificación |
| `pnpm test:watch` | Tests en modo watch | Desarrollo TDD |
| `pnpm test auth` | Tests de módulo específico | Testing focused |

### **Calidad de Código**
| Comando | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| `pnpm format` | Formatear código | Auto en save (VS Code) |
| `pnpm lint` | Linting sin fix | CI/CD |
| `pnpm typecheck` | Verificar tipos TS | CI/CD y pre-commit |

## 🏗️ Agregar Nueva Feature

### **1. Crear Estructura del Módulo**
```bash
mkdir src/modules/nueva-feature
cd src/modules/nueva-feature

# Crear archivos base
touch nueva-feature.router.ts
touch nueva-feature.service.ts
touch nueva-feature.repo.ts
touch nueva-feature.dto.ts
touch nueva-feature.mapper.ts
```

### **2. Template para Router**
```typescript
// nueva-feature.router.ts
import { Router } from "express";
import { requireAuth } from "../auth/requireAuth";
import { NuevaFeatureService } from "./nueva-feature.service";

export const nuevaFeatureRouter = Router();

nuevaFeatureRouter.get("/nueva-feature", requireAuth, async (req, res, next) => {
    try {
        const result = await NuevaFeatureService.getAll();
        res.json(result);
    } catch (error) {
        next(error);
    }
});
```

### **3. Template para Service**
```typescript
// nueva-feature.service.ts
import { NuevaFeatureRepo } from "./nueva-feature.repo";
import { NotFound } from "../../common/http/errors";

export class NuevaFeatureService {
    static async getAll() {
        const items = await NuevaFeatureRepo.findAll();
        return items;
    }

    static async getById(id: number) {
        const item = await NuevaFeatureRepo.findById(id);
        if (!item) {
            throw new NotFound("Item not found");
        }
        return item;
    }
}
```

### **4. Template para Repository**
```typescript
// nueva-feature.repo.ts
import { db } from "../../infra/db/client";
import { nuevaFeatureTable } from "../../infra/db/schema";
import { eq } from "drizzle-orm";

export class NuevaFeatureRepo {
    static async findAll() {
        return await db.select().from(nuevaFeatureTable);
    }

    static async findById(id: number) {
        const [item] = await db
            .select()
            .from(nuevaFeatureTable)
            .where(eq(nuevaFeatureTable.id, id))
            .limit(1);
        return item;
    }
}
```

### **5. Agregar a Schema de DB**
```typescript
// src/infra/db/schema.ts
export const nuevaFeatureTable = pgTable("nueva_feature", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});
```

### **6. Registrar Router**
```typescript
// src/app.ts (o donde registres rutas)
import { nuevaFeatureRouter } from "./modules/nueva-feature/nueva-feature.router";

app.use("/api", nuevaFeatureRouter);
```

### **7. Generar y Aplicar Migración**
```bash
pnpm db:gen
pnpm db:migrate
```

## 🧪 Testing Strategy

### **Estructura de Tests**
```
src/test/
├── unit/                      # Tests unitarios
│   ├── services/             # Test de services
│   └── repositories/         # Test de repositories
├── integration/              # Tests de integración
│   └── modules/              # Tests de módulos completos
└── e2e/                      # Tests end-to-end
    └── *.e2e.test.ts         # Tests de API completos
```

### **Test Unitario - Service**
```typescript
// src/test/unit/services/users.service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { UsersService } from '../../../modules/users/users.service';
import { UsersRepo } from '../../../modules/users/users.repo';

// Mock del repository
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

### **Test E2E - API**
```typescript
// src/test/e2e/users.e2e.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app';

describe('Users API', () => {
    let authToken: string;

    beforeAll(async () => {
        // Setup: crear usuario y obtener token
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

### **Logging para Debug**
```typescript
// Usar logger estructurado
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
// Habilitar query logging en desarrollo
// src/infra/db/client.ts
const client = postgres(env.DATABASE_URL, {
    debug: env.NODE_ENV === 'development' // Log SQL queries
});
```

## 📊 Performance Tips

### **Database Queries**
```typescript
// ✅ BUENO: Select específico
const users = await db
    .select({ id: usersTable.id, name: usersTable.name })
    .from(usersTable);

// ❌ MALO: Select *
const users = await db.select().from(usersTable);

// ✅ BUENO: Usar límites
const users = await db
    .select()
    .from(usersTable)
    .limit(10);

// ✅ BUENO: Índices en where clauses
const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id)) // id está indexado
    .limit(1);
```

### **Memory Management**
```typescript
// ✅ BUENO: Streaming para large datasets
async function* getUsersStream() {
    const users = await db.select().from(usersTable);
    for (const user of users) {
        yield user;
    }
}

// ✅ BUENO: Pagination
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

## ➡️ Siguiente Paso

Continúa con [**Base de Datos**](./05-database.md) para aprender sobre schemas, migraciones y Drizzle ORM.
