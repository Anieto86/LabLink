import {
	boolean,
	index,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Refresh Tokens table - Manages JWT refresh tokens for authentication
 * Stores tokens for secure session management and token rotation
 */
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
