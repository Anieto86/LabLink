import { bigint, bigserial, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { equipmentStatus } from "./enums";
import { laboratories } from "./laboratories";

/**
 * Equipment table - Manages laboratory equipment and instruments
 * Tracks equipment status, location, and maintenance information
 */
export const equipments = pgTable(
	"equipments",
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
		labIdx: index("equipments_laboratory_id_idx").on(table.laboratoryId),
	})
);
