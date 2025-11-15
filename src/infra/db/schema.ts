import {
	bigint,
	bigserial,
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

// ---------- Enums ----------

export const equipmentStatus = pgEnum("equipment_status", [
	"available",
	"in_use",
	"maintenance",
	"out_of_order",
	"retired",
]);

export const formStatus = pgEnum("form_status", ["draft", "published", "archived"]);

export const userRole = pgEnum("user_role", ["admin", "scientist", "student", "tech", "viewer"]);

// ---------- Users ----------

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

// ---------- Laboratories ----------

export const laboratories = pgTable("laboratories", {
	id: bigserial("id", { mode: "number" }).primaryKey(),
	name: text("name").notNull(),
	location: text("location"),
	capacity: integer("capacity"),
});

// ---------- Equipment ----------

export const equipment = pgTable(
	"equipment",
	{
		id: bigserial("id", { mode: "number" }).primaryKey(),
		name: text("name").notNull(),
		type: text("type"),
		laboratoryId: bigint("laboratory_id", { mode: "number" }).references(() => laboratories.id),
		status: equipmentStatus("status").default("available"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		labIdx: index("equipment_laboratory_id_idx").on(table.laboratoryId),
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
