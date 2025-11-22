import type { InferSelectModel } from "drizzle-orm";
import type { laboratories } from "../../infra/db/schema";

export type LaboratoryRow = InferSelectModel<typeof laboratories>;

export function toLaboratoryRead(lab: LaboratoryRow) {
	return {
		id: lab.id,
		name: lab.name,
		location: lab.location ?? null,
		capacity: lab.capacity ?? null,
		createdAt: lab.createdAt?.toISOString() ?? new Date().toISOString(),
	};
}
