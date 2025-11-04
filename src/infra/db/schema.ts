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
		passwordHash: varchar("password_hash", { length: 255 }).notNull(),
		isActive: boolean("is_active").default(true).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(t) => ({
		emailIdx: uniqueIndex("user_email_idx").on(t.email),
	}),
);

/* ---------------- REFRESH TOKENS TABLE ---------------- */
export const refreshTokens = pgTable(
	"refresh_tokens",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id").notNull(),
		token: text("token").notNull(),
		isRevoked: boolean("is_revoked").notNull().default(false),
		replacedByToken: text("replaced_by_token"),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(t) => ({
		tokenUq: uniqueIndex("refresh_token_uq").on(t.token),
		userIdx: index("refresh_user_idx").on(t.userId),
	}),
);
