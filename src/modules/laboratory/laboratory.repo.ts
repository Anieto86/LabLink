import { eq } from "drizzle-orm";
import { db } from "../../infra/db/client";
import { laboratories } from "../../infra/db/schema";
import type { LaboratoryCreate } from "./laboratory.dtos";
import type { LaboratoryRow } from "./laboratory.mapper";

export const LaboratoriesRepo = {
	findById: async (id: number): Promise<LaboratoryRow | null> => {
		const [row] = await db.select().from(laboratories).where(eq(laboratories.id, id)).limit(1);
		return row ?? null;
	},

	findAll: async (): Promise<LaboratoryRow[]> => {
		const rows = await db.select().from(laboratories);
		return rows;
	},

	create: async (data: LaboratoryCreate): Promise<LaboratoryRow> => {
		const [row] = await db
			.insert(laboratories)
			.values({
				name: data.name,
				location: data.location,
				capacity: data.capacity,
			})
			.returning();
		if (!row) {
			throw new Error("Failed to create laboratory");
		}
		return row;
	},
};
