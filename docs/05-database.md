# Database

This guide covers everything related to PostgreSQL database, Drizzle ORM, migrations, and data management.

## 🗄️ Database Configuration

### **PostgreSQL Setup**
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Install PostgreSQL (macOS with Homebrew)
brew install postgresql
brew services start postgresql

# Install PostgreSQL (Windows)
# Download from: https://www.postgresql.org/download/windows/
```

### **Create Database**
```sql
-- Connect as superuser
psql -U postgres

-- Create database for LabLink
CREATE DATABASE biotrack_db;

-- Create specific user (optional but recommended)
CREATE USER lablink_user WITH ENCRYPTED PASSWORD 'secure_password_here';

-- Grant permissions to user
GRANT ALL PRIVILEGES ON DATABASE biotrack_db TO lablink_user;
GRANT USAGE ON SCHEMA public TO lablink_user;
GRANT CREATE ON SCHEMA public TO lablink_user;

-- Verify connection
\c biotrack_db lablink_user
\dt  -- List tables (should be empty initially)
```

### **Environment Variables**
```env
# .env
DATABASE_URL="postgresql://lablink_user:secure_password_here@localhost:5432/biotrack_db"

# For local development with default postgres user:
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/biotrack_db"

# For production with SSL:
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

---

## 🏗️ Drizzle ORM

### **Why Drizzle?**
- **Type Safety**: 100% type-safe queries at compile time
- **SQL-like**: Similar syntax to SQL, easy to learn
- **Zero Runtime**: No runtime overhead, only types
- **Migration Management**: Full control over migrations
- **Performance**: Optimized queries without abstraction penalty

### **Drizzle Configuration**

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

// Configure PostgreSQL client
const client = postgres(env.DATABASE_URL, {
  max: 10,                    // Connection pool
  idle_timeout: 20,           // Timeout for idle connections
  connect_timeout: 10,        // Connection timeout
  prepare: false,             // Use prepared statements
});

// Create Drizzle instance
export const db = drizzle(client);

// Function to close connections (useful in tests)
export async function closeDatabase() {
  await client.end();
}
```

---

## 📋 Schema Definition

### **Current Schema**

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

// Indexes for performance
export const emailIndex = pgIndex('email_idx').on(usersTable.email);
export const roleIndex = pgIndex('role_idx').on(usersTable.role);

// Export types for TypeScript
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
```

### **Adding New Table**
```typescript
// Example: laboratories table
export const laboratoriesTable = pgTable('laboratories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  
  // Foreign key to users (laboratory director)
  directorId: integer('director_id').references(() => usersTable.id),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many, one }) => ({
  // A user can direct many laboratories
  directedLaboratories: many(laboratoriesTable),
}));

export const laboratoriesRelations = relations(laboratoriesTable, ({ one }) => ({
  // A laboratory has one director
  director: one(usersTable, {
    fields: [laboratoriesTable.directorId],
    references: [usersTable.id],
  }),
}));
```

---

## 🔄 Migrations

### **Migration Workflow**

#### 1. **Modify Schema**
```typescript
// Change in src/infra/db/schema.ts
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('USER').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  
  // ✅ NEW: added field
  phoneNumber: varchar('phone_number', { length: 20 }),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

#### 2. **Generate Migration**
```bash
pnpm db:gen
```

This creates a file in `drizzle/migrations/`:
```sql
-- drizzle/migrations/0001_add_phone_number.sql
ALTER TABLE "users" ADD COLUMN "phone_number" varchar(20);
```

#### 3. **Review Migration**
```bash
# Review generated SQL
cat drizzle/migrations/0001_add_phone_number.sql

# Verify it's correct before applying
```

#### 4. **Apply Migration**
```bash
pnpm db:migrate
```

#### 5. **Verify in Database**
```bash
pnpm db:studio
# Or connect directly:
psql -d biotrack_db -c "\\d users"
```

### **Complex Migrations**

#### **Add Column with Data**
```sql
-- Manual migration for complex data
-- drizzle/migrations/0002_populate_phone_numbers.sql

-- 1. Add column
ALTER TABLE "users" ADD COLUMN "phone_number" varchar(20);

-- 2. Populate existing data (example)
UPDATE "users" 
SET "phone_number" = '+1-555-0000' 
WHERE "phone_number" IS NULL AND "role" = 'ADMIN';

-- 3. Make NOT NULL if necessary
-- ALTER TABLE "users" ALTER COLUMN "phone_number" SET NOT NULL;
```

#### **Rename Column**
```sql
-- Drizzle doesn't handle renames automatically, do it manually:
ALTER TABLE "users" RENAME COLUMN "is_active" TO "active";
```

#### **Data Migration**
```sql
-- Migrate data between tables
INSERT INTO "laboratories" ("name", "director_id", "created_at")
SELECT 
  CONCAT("name", ' Lab') as "name",
  "id" as "director_id", 
  NOW() as "created_at"
FROM "users" 
WHERE "role" = 'ADMIN';
```

### **Migration Rollback**
```bash
# Drizzle doesn't have automatic rollback
# Strategies:

# 1. Backup before migrating
pg_dump biotrack_db > backup_before_migration.sql

# 2. Manual reverse migration
psql -d biotrack_db -f rollback_migration.sql

# 3. Restore from backup
psql -d biotrack_db < backup_before_migration.sql
```

---

## 🔍 Drizzle Studio

### **Start Drizzle Studio**
```bash
pnpm db:studio
```

Opens GUI at: `https://local.drizzle.studio`

### **Studio Features**
- 📊 **View tables** and data in real time
- ✏️ **Edit data** directly from interface
- 🔍 **Execute custom SQL** queries
- 📈 **View relationships** between tables
- 📋 **Export data** in different formats
- 🗂️ **Navigate schema** and DB structure

---

## 📝 Queries with Drizzle

### **Basic Queries**

#### **Select**
```typescript
// All users
const allUsers = await db.select().from(usersTable);

// Specific select
const userEmails = await db
  .select({ 
    id: usersTable.id, 
    email: usersTable.email 
  })
  .from(usersTable);

// With conditions
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

// With limits and ordering
const recentUsers = await db
  .select()
  .from(usersTable)
  .orderBy(usersTable.createdAt, 'desc')
  .limit(10)
  .offset(0);
```

#### **Insert**
```typescript
// Single insert
const [newUser] = await db
  .insert(usersTable)
  .values({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: 'USER'
  })
  .returning();

// Multiple insert
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
// Update with condition
const [updatedUser] = await db
  .update(usersTable)
  .set({ 
    name: 'New Name',
    updatedAt: new Date()
  })
  .where(eq(usersTable.id, 1))
  .returning();

// Multiple update
await db
  .update(usersTable)
  .set({ isActive: false })
  .where(eq(usersTable.role, 'USER'));
```

#### **Delete**
```typescript
// Delete with condition
await db
  .delete(usersTable)
  .where(eq(usersTable.id, 1));

// Multiple delete
await db
  .delete(usersTable)
  .where(eq(usersTable.isActive, false));
```

### **Advanced Queries**

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

#### **Aggregations**
```typescript
import { count, sum, avg, max, min } from 'drizzle-orm';

// Count users by role
const userCounts = await db
  .select({
    role: usersTable.role,
    count: count()
  })
  .from(usersTable)
  .groupBy(usersTable.role);

// Statistics
const stats = await db
  .select({
    totalUsers: count(),
    activeUsers: count().where(eq(usersTable.isActive, true))
  })
  .from(usersTable);
```

#### **Subqueries**
```typescript
// Users who direct laboratories
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

#### **Transactions**
```typescript
await db.transaction(async (tx) => {
  // 1. Create user
  const [user] = await tx
    .insert(usersTable)
    .values({ name: 'Director', email: 'director@lab.com', password: 'hash' })
    .returning();

  // 2. Create laboratory with that user as director
  await tx
    .insert(laboratoriesTable)
    .values({
      name: 'New Lab',
      directorId: user.id,
      location: 'Building A'
    });

  // If any operation fails, entire transaction is reverted
});
```

---

## 🚀 Performance and Optimization

### **Indexes**
```typescript
// In schema.ts
import { index, uniqueIndex } from 'drizzle-orm/pg-core';

// Simple index
export const emailIndex = index('email_idx').on(usersTable.email);

// Unique index
export const uniqueEmailIndex = uniqueIndex('unique_email_idx').on(usersTable.email);

// Composite index
export const roleActiveIndex = index('role_active_idx')
  .on(usersTable.role, usersTable.isActive);

// Partial index
export const activeUsersIndex = index('active_users_idx')
  .on(usersTable.email)
  .where(eq(usersTable.isActive, true));
```

### **Query Optimization**
```typescript
// ✅ GOOD: Select only necessary fields
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

// ✅ GOOD: Use prepared statements for repetitive queries
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
  max: 20,                    // Maximum 20 connections
  idle_timeout: 30,           // Close idle connections after 30s
  connect_timeout: 10,        // Connection timeout 10s
  prepare: true,              // Use prepared statements
  transform: {
    undefined: null,          // Convert undefined to null
  },
});
```

---

## 🧪 Testing with Database

### **Test Database Setup**
```typescript
// src/test/setup/database.ts
import { db, closeDatabase } from '../../infra/db/client';
import { usersTable } from '../../infra/db/schema';

export async function setupTestDatabase() {
  // Clean all tables
  await db.delete(usersTable);
  
  // Insert test data
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

### **Testing with Transactions**
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

## 🔧 Maintenance

### **Backup and Restore**
```bash
# Backup
pg_dump biotrack_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump biotrack_db | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Restore
psql biotrack_db < backup_20251101_120000.sql

# Restore compressed
gunzip -c backup_20251101_120000.sql.gz | psql biotrack_db
```

### **Monitoring**
```sql
-- View active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'biotrack_db';

-- View slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- View table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_relation_size(schemaname||'.'||tablename) DESC;
```

---

## ➡️ Next Step

Continue with [**Authentication & Security**](./06-authentication.md) to understand the JWT system and implemented security measures.