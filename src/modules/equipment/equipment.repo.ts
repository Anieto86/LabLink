import { eq } from "drizzle-orm";
import { db } from "../../infra/db/client.js";
import { equipment } from "../../infra/db/schema.js";
import type { EquipmentRow } from "./equipment.mapper.js";

export const EquipmentRepo = {
	findById: async (id: number): Promise<EquipmentRow | null> => {
		const [row] = await db.select().from(equipment).where(eq(equipment.id, id)).limit(1);
		return row ?? null;
	},
	findByLaboratoryId: async (laboratoryId: number): Promise<EquipmentRow[] | null> => {
		const rows = await db.select().from(equipment).where(eq(equipment.laboratoryId, laboratoryId));
		return rows.length > 0 ? rows : null;
	},
};
