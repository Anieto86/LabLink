import type { InferSelectModel } from "drizzle-orm";
import type { equipment } from "../../infra/db/schema.js";
import type { EquipmentRead } from "./equipment.dtos.js";

/**
 * Representa la fila cruda que viene desde Drizzle.
 * (Usa el mismo naming camelCase que el schema).
 */
// export type EquipmentRow = {
// 	id: number;
// 	name: string;
// 	type: string | null;
// 	laboratoryId: number | null;
// 	status: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | null;
// 	createdAt: Date | null;
// };
export type EquipmentRow = InferSelectModel<typeof equipment>;
/**
 * Transforma una fila cruda (DB) en un objeto público (DTO).
 * Asegura defaults y formateos seguros.
 */
export function toEquipmentRead(e: EquipmentRow): EquipmentRead {
	return {
		id: e.id,
		name: e.name,
		type: e.type ?? "Unknown",
		laboratoryId: e.laboratoryId ?? 0,
		status: (e.status ?? "AVAILABLE") as EquipmentRead["status"],
		createdAt: e.createdAt?.toISOString() ?? new Date().toISOString(),
	};
}
