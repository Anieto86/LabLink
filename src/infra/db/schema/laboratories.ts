import { bigserial, integer, pgTable, text } from "drizzle-orm/pg-core";

/**
 * Laboratories table - Manages laboratory facilities
 * Stores laboratory information including location and capacity
 */
export const laboratories = pgTable("laboratories", {
	id: bigserial("id", { mode: "number" }).primaryKey(),
	name: text("name").notNull(),
	location: text("location"),
	capacity: integer("capacity"),
});
