import { z } from "zod";

/** = EquipmentBase (contrato público) */

export const equipmentCreateDto = z.object({
	name: z.string().min(2, "Name is required").max(100, "Name is too long"),
	type: z.string().min(2, "Type is required").max(100, "Type is too long"),
	laboratoryId: z.coerce.number().int().positive("Laboratory id must be positive"),
	status: z
		.enum(["available", "inUse", "maintenance", "outOfOrder", "retired"])
		.default("available"),
});

export const equipmentReadDto = equipmentCreateDto.extend({
	id: z.number().int(),
	createdAt: z.string().datetime(),
});

// types (contrato público)
export type EquipmentCreate = z.infer<typeof equipmentCreateDto>;
export type EquipmentRead = z.infer<typeof equipmentReadDto>;
