import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "../../config/env.js";

/**
 * PostgreSQL connection pool configuration
 * Uses environment variable DATABASE_URL for connection string
 */
const pool = new Pool({ connectionString: DATABASE_URL });

/**
 * Drizzle ORM database client
 * Provides type-safe database operations with PostgreSQL
 * All repository classes should use this client for database access
 */
export const db = drizzle(pool);
