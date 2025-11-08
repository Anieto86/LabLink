import {
	boolean,
	index,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

/* ---------------- USERS TABLE ---------------- */
export const users = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		role: varchar("role", { length: 100 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		password_hash: varchar("password_hash", { length: 255 }).notNull(),
		is_active: boolean("is_active").default(true).notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(t) => ({
		emailIdx: uniqueIndex("user_email_idx").on(t.email),
	})
);

/* ---------------- EQUIPMENT TABLE ---------------- */

export const equipment = pgTable(
	"equipment",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		type: varchar("type", { length: 100 }),
		laboratory_id: integer("laboratory_id"),
		status: varchar("status", { length: 50 }),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	// The (t) => ({ ... }) tells Drizzle:
	// "in addition to columns, I want to create indexes on certain fields".
	(t) => ({
		labIdx: index("equipment_lab_idx").on(t.laboratory_id),
		statusIdx: index("equipment_status_idx").on(t.status),
	})
);

/* ---------------- REFRESH TOKENS TABLE ---------------- */
export const refreshTokens = pgTable(
	"refresh_tokens",
	{
		id: serial("id").primaryKey(),
		user_id: integer("user_id").notNull(),
		token: text("token").notNull(),
		is_revoked: boolean("is_revoked").notNull().default(false),
		replaced_by_token: text("replaced_by_token"),
		expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(t) => ({
		tokenUq: uniqueIndex("refresh_token_uq").on(t.token),
		userIdx: index("refresh_user_idx").on(t.user_id),
	})
);
