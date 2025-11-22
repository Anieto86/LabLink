import { bigserial, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Laboratories table - Manages laboratory facilities
 * Stores laboratory information including location and capacity
 */
export const laboratories = pgTable(
	"laboratories",
	{
		id: bigserial("id", { mode: "number" }).primaryKey(),
		name: text("name").notNull(),
		location: text("location"),
		capacity: integer("capacity"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(t) => ({
		nameIdx: index("laboratories_name_idx").on(t.name),
	})
);
