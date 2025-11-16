import { bigserial, boolean, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { userRole } from "./enums";

/**
 * Users table - Manages user accounts and authentication
 * Stores user information, roles, and account status
 */
export const users = pgTable(
	"users",
	{
		id: bigserial("id", { mode: "number" }).primaryKey(),
		name: text("name").notNull(),
		role: userRole("role").default("viewer"),
		email: text("email").notNull(), // consider citext via migration if needed
		passwordHash: text("password_hash").notNull(),
		isActive: boolean("is_active").notNull().default(true),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		emailUniqueIdx: uniqueIndex("users_email_unique").on(table.email),
	})
);
