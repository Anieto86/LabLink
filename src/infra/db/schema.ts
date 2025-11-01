import {
	boolean,
	pgTable,
	serial,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		role: varchar("role", { length: 100 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		passwordHash: varchar("password_hash", { length: 255 }).notNull(),
		isActive: boolean("is_active").notNull().default(true),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(t) => ({
		emailUq: uniqueIndex("users_email_uq").on(t.email),
	}),
);
