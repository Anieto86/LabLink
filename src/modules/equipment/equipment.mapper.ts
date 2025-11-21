import type { InferSelectModel } from "drizzle-orm";
import type { equipment } from "../../infra/db/schema.js";
import type { EquipmentRead } from "./equipment.dtos.js";

/**
 * Representa la fila cruda que viene desde Drizzle.
 * (Usa el mismo naming camelCase que el schema).
 */
export type EquipmentRow = InferSelectModel<typeof equipment>;

type DbStatus = "available" | "in_use" | "maintenance" | "out_of_order" | "retired";

const statusMap: Record<DbStatus, EquipmentRead["status"]> = {
	available: "available",
	in_use: "inUse",
	maintenance: "maintenance",
	out_of_order: "outOfOrder",
	retired: "retired",
};

/**
 * Transforma una fila cruda (DB) en un objeto publico (DTO).
 * Asegura defaults y formateos seguros. Status se mapea a camelCase para la API.
 */
export function toEquipmentRead(row: EquipmentRow): EquipmentRead {
	const status = statusMap[(row.status ?? "available") as DbStatus];
	return {
		id: row.id,
		name: row.name,
		type: row.type ?? "Unknown",
		laboratoryId: row.laboratoryId ?? 0,
		status,
		createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
	};
}
