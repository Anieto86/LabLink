# Base de Datos

Esta guía cubre todo lo relacionado con la base de datos PostgreSQL, Drizzle ORM, migraciones y administración de datos.

## 🗄️ Configuración de Base de Datos

### **PostgreSQL Setup**
```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Instalar PostgreSQL (macOS con Homebrew)
brew install postgresql
brew services start postgresql

# Instalar PostgreSQL (Windows)
# Descargar desde: https://www.postgresql.org/download/windows/
```

### **Crear Base de Datos**
```sql
-- Conectar como superuser
psql -U postgres

-- Crear base de datos para LabLink
CREATE DATABASE biotrack_db;

-- Crear usuario específico (opcional pero recomendado)
CREATE USER lablink_user WITH ENCRYPTED PASSWORD 'secure_password_here';

-- Dar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE biotrack_db TO lablink_user;
GRANT USAGE ON SCHEMA public TO lablink_user;
GRANT CREATE ON SCHEMA public TO lablink_user;

-- Verificar conexión
\\c biotrack_db lablink_user
\\dt  -- Listar tablas (debería estar vacío inicialmente)
```

### **Variables de Entorno**
```env
# .env
DATABASE_URL="postgresql://lablink_user:secure_password_here@localhost:5432/biotrack_db"

# Para desarrollo local con postgres default user:
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/biotrack_db"

# Para producción con SSL:
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

---

## 🏗️ Drizzle ORM

### **¿Por qué Drizzle?**
- **Type Safety**: Queries 100% type-safe en compile time
- **SQL-like**: Sintaxis similar a SQL, fácil de aprender
- **Zero Runtime**: Sin overhead en runtime, solo types
- **Migration Management**: Control total sobre migraciones
- **Performance**: Queries optimizadas sin abstraction penalty

### **Configuración de Drizzle**

#### `drizzle.config.ts`
```typescript
import type { Config } from 'drizzle-kit';
import { env } from './src/config/env';

export default {
  schema: './src/infra/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

#### `src/infra/db/client.ts`
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../../config/env';

// Configurar cliente PostgreSQL
const client = postgres(env.DATABASE_URL, {
  max: 10,                    // Pool de conexiones
  idle_timeout: 20,           // Timeout para conexiones idle
  connect_timeout: 10,        // Timeout para conectar
  prepare: false,             // Usar prepared statements
});

// Crear instancia de Drizzle
export const db = drizzle(client);

// Función para cerrar conexiones (útil en tests)
export async function closeDatabase() {
  await client.end();
}
```

---

## 📋 Schema Definition

### **Esquema Actual**

#### `src/infra/db/schema.ts`
```typescript
import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  pgEnum
} from 'drizzle-orm/pg-core';

// Enums
export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);

// Users Table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(), // bcrypt hash
  role: roleEnum('role').default('USER').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Indexes para performance
export const emailIndex = pgIndex('email_idx').on(usersTable.email);
export const roleIndex = pgIndex('role_idx').on(usersTable.role);

// Export types para TypeScript
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
```

### **Agregar Nueva Tabla**
```typescript
// Ejemplo: tabla de laboratorios
export const laboratoriesTable = pgTable('laboratories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),

  // Foreign key a users (director del laboratorio)
  directorId: integer('director_id').references(() => usersTable.id),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relaciones
export const usersRelations = relations(usersTable, ({ many, one }) => ({
  // Un usuario puede dirigir muchos laboratorios
  directedLaboratories: many(laboratoriesTable),
}));

export const laboratoriesRelations = relations(laboratoriesTable, ({ one }) => ({
  // Un laboratorio tiene un director
  director: one(usersTable, {
    fields: [laboratoriesTable.directorId],
    references: [usersTable.id],
  }),
}));
```

---

## 🔄 Migraciones

### **Workflow de Migraciones**

#### 1. **Modificar Schema**
```typescript
// Cambio en src/infra/db/schema.ts
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('USER').notNull(),
  isActive: boolean('is_active').default(true).notNull(),

  // ✅ NUEVO: campo agregado
  phoneNumber: varchar('phone_number', { length: 20 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

#### 2. **Generar Migración**
```bash
pnpm db:gen
```

Esto crea un archivo en `drizzle/migrations/`:
```sql
-- drizzle/migrations/0001_add_phone_number.sql
ALTER TABLE "users" ADD COLUMN "phone_number" varchar(20);
```

#### 3. **Revisar Migración**
```bash
# Revisar el SQL generado
cat drizzle/migrations/0001_add_phone_number.sql

# Verificar que sea correcto antes de aplicar
```

#### 4. **Aplicar Migración**
```bash
pnpm db:migrate
```

#### 5. **Verificar en Base de Datos**
```bash
pnpm db:studio
# O conectar directamente:
psql -d biotrack_db -c "\\d users"
```

### **Migraciones Complejas**

#### **Agregar Columna con Datos**
```sql
-- Migración manual para datos complejos
-- drizzle/migrations/0002_populate_phone_numbers.sql

-- 1. Agregar columna
ALTER TABLE "users" ADD COLUMN "phone_number" varchar(20);

-- 2. Poblar datos existentes (ejemplo)
UPDATE "users"
SET "phone_number" = '+1-555-0000'
WHERE "phone_number" IS NULL AND "role" = 'ADMIN';

-- 3. Hacer NOT NULL si es necesario
-- ALTER TABLE "users" ALTER COLUMN "phone_number" SET NOT NULL;
```

#### **Renombrar Columna**
```sql
-- Drizzle no maneja renames automáticamente, hacerlo manual:
ALTER TABLE "users" RENAME COLUMN "is_active" TO "active";
```

#### **Migración de Datos**
```sql
-- Migrar datos entre tablas
INSERT INTO "laboratories" ("name", "director_id", "created_at")
SELECT
  CONCAT("name", ' Lab') as "name",
  "id" as "director_id",
  NOW() as "created_at"
FROM "users"
WHERE "role" = 'ADMIN';
```

### **Rollback de Migraciones**
```bash
# Drizzle no tiene rollback automático
# Estrategias:

# 1. Backup antes de migrar
pg_dump biotrack_db > backup_before_migration.sql

# 2. Migración manual reversa
psql -d biotrack_db -f rollback_migration.sql

# 3. Restaurar desde backup
psql -d biotrack_db < backup_before_migration.sql
```

---

## 🔍 Drizzle Studio

### **Iniciar Drizzle Studio**
```bash
pnpm db:studio
```

Abre GUI en: `https://local.drizzle.studio`

### **Funcionalidades de Studio**
- 📊 **Visualizar tablas** y datos en tiempo real
- ✏️ **Editar datos** directamente desde la interfaz
- 🔍 **Ejecutar queries** SQL personalizadas
- 📈 **Ver relaciones** entre tablas
- 📋 **Exportar datos** en diferentes formatos
- 🗂️ **Navegar schema** y estructura de DB

---

## 📝 Queries con Drizzle

### **Queries Básicas**

#### **Select**
```typescript
// Todos los usuarios
const allUsers = await db.select().from(usersTable);

// Select específico
const userEmails = await db
  .select({
    id: usersTable.id,
    email: usersTable.email
  })
  .from(usersTable);

// Con condiciones
import { eq, and, or, like, gt } from 'drizzle-orm';

const activeAdmins = await db
  .select()
  .from(usersTable)
  .where(
    and(
      eq(usersTable.role, 'ADMIN'),
      eq(usersTable.isActive, true)
    )
  );

// Con límites y ordenamiento
const recentUsers = await db
  .select()
  .from(usersTable)
  .orderBy(usersTable.createdAt, 'desc')
  .limit(10)
  .offset(0);
```

#### **Insert**
```typescript
// Insert único
const [newUser] = await db
  .insert(usersTable)
  .values({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: 'USER'
  })
  .returning();

// Insert múltiple
const newUsers = await db
  .insert(usersTable)
  .values([
    { name: 'User 1', email: 'user1@example.com', password: 'hash1' },
    { name: 'User 2', email: 'user2@example.com', password: 'hash2' }
  ])
  .returning();
```

#### **Update**
```typescript
// Update con condición
const [updatedUser] = await db
  .update(usersTable)
  .set({
    name: 'New Name',
    updatedAt: new Date()
  })
  .where(eq(usersTable.id, 1))
  .returning();

// Update múltiple
await db
  .update(usersTable)
  .set({ isActive: false })
  .where(eq(usersTable.role, 'USER'));
```

#### **Delete**
```typescript
// Delete con condición
await db
  .delete(usersTable)
  .where(eq(usersTable.id, 1));

// Delete múltiple
await db
  .delete(usersTable)
  .where(eq(usersTable.isActive, false));
```

### **Queries Avanzadas**

#### **Joins**
```typescript
// Inner join
const usersWithLabs = await db
  .select({
    userName: usersTable.name,
    userEmail: usersTable.email,
    labName: laboratoriesTable.name,
    labLocation: laboratoriesTable.location
  })
  .from(usersTable)
  .innerJoin(
    laboratoriesTable,
    eq(usersTable.id, laboratoriesTable.directorId)
  );

// Left join
const allUsersWithOptionalLabs = await db
  .select()
  .from(usersTable)
  .leftJoin(
    laboratoriesTable,
    eq(usersTable.id, laboratoriesTable.directorId)
  );
```

#### **Agregaciones**
```typescript
import { count, sum, avg, max, min } from 'drizzle-orm';

// Contar usuarios por rol
const userCounts = await db
  .select({
    role: usersTable.role,
    count: count()
  })
  .from(usersTable)
  .groupBy(usersTable.role);

// Estadísticas
const stats = await db
  .select({
    totalUsers: count(),
    activeUsers: count().where(eq(usersTable.isActive, true))
  })
  .from(usersTable);
```

#### **Subqueries**
```typescript
// Usuarios que dirigen laboratorios
const labDirectors = await db
  .select()
  .from(usersTable)
  .where(
    inArray(
      usersTable.id,
      db.select({ id: laboratoriesTable.directorId }).from(laboratoriesTable)
    )
  );
```

#### **Transacciones**
```typescript
await db.transaction(async (tx) => {
  // 1. Crear usuario
  const [user] = await tx
    .insert(usersTable)
    .values({ name: 'Director', email: 'director@lab.com', password: 'hash' })
    .returning();

  // 2. Crear laboratorio con ese usuario como director
  await tx
    .insert(laboratoriesTable)
    .values({
      name: 'New Lab',
      directorId: user.id,
      location: 'Building A'
    });

  // Si cualquier operación falla, toda la transacción se revierte
});
```

---

## 🚀 Performance y Optimización

### **Índices**
```typescript
// En schema.ts
import { index, uniqueIndex } from 'drizzle-orm/pg-core';

// Índice simple
export const emailIndex = index('email_idx').on(usersTable.email);

// Índice único
export const uniqueEmailIndex = uniqueIndex('unique_email_idx').on(usersTable.email);

// Índice compuesto
export const roleActiveIndex = index('role_active_idx')
  .on(usersTable.role, usersTable.isActive);

// Índice parcial
export const activeUsersIndex = index('active_users_idx')
  .on(usersTable.email)
  .where(eq(usersTable.isActive, true));
```

### **Query Optimization**
```typescript
// ✅ BUENO: Select solo campos necesarios
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

// ✅ BUENO: Usar prepared statements para queries repetitivas
const getUserById = db
  .select()
  .from(usersTable)
  .where(eq(usersTable.id, $1))
  .prepare();

const user = await getUserById.execute(userId);
```

### **Connection Pooling**
```typescript
// src/infra/db/client.ts
const client = postgres(env.DATABASE_URL, {
  max: 20,                    // Máximo 20 conexiones
  idle_timeout: 30,           // Cerrar conexiones idle después de 30s
  connect_timeout: 10,        // Timeout de conexión 10s
  prepare: true,              // Usar prepared statements
  transform: {
    undefined: null,          // Convertir undefined a null
  },
});
```

---

## 🧪 Testing con Base de Datos

### **Test Database Setup**
```typescript
// src/test/setup/database.ts
import { db, closeDatabase } from '../../infra/db/client';
import { usersTable } from '../../infra/db/schema';

export async function setupTestDatabase() {
  // Limpiar todas las tablas
  await db.delete(usersTable);

  // Insertar datos de prueba
  await db.insert(usersTable).values([
    {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'USER'
    },
    {
      name: 'Test Admin',
      email: 'admin@example.com',
      password: 'hashedPassword',
      role: 'ADMIN'
    }
  ]);
}

export async function teardownTestDatabase() {
  await closeDatabase();
}
```

### **Test con Transacciones**
```typescript
// src/test/unit/repositories/users.repo.test.ts
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { db } from '../../../infra/db/client';
import { UsersRepo } from '../../../modules/users/users.repo';
import { setupTestDatabase, teardownTestDatabase } from '../../setup/database';

describe('UsersRepo', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  it('should find user by id', async () => {
    // Test implementation
    const user = await UsersRepo.findById(1);
    expect(user).toBeDefined();
    expect(user?.email).toBe('test@example.com');
  });
});
```

---

## 🔧 Mantenimiento

### **Backup y Restore**
```bash
# Backup
pg_dump biotrack_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup comprimido
pg_dump biotrack_db | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Restore
psql biotrack_db < backup_20251101_120000.sql

# Restore comprimido
gunzip -c backup_20251101_120000.sql.gz | psql biotrack_db
```

### **Monitoreo**
```sql
-- Ver conexiones activas
SELECT count(*) FROM pg_stat_activity WHERE datname = 'biotrack_db';

-- Ver queries lentas
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Ver tamaño de tablas
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_relation_size(schemaname||'.'||tablename) DESC;
```

---

## ➡️ Siguiente Paso

Continúa con [**Autenticación y Seguridad**](./06-authentication.md) para entender el sistema JWT y las medidas de seguridad implementadas.
