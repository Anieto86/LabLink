import { z } from "zod";

/** = EquipmentBase */

export const equipmentCreateDto = z.object({
	name: z.string().min(2, "Name is required").max(100, "Name is too long"),
	type: z.string().min(2, "Type is required").max(100, "Type is too long"),
	laboratory_id: z.string().min(2, "Laboratory is required").max(100, "Laboratory is too long"),
	status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE"]).default("AVAILABLE"),
});

export const equipmentReadDto = equipmentCreateDto.extend({
	id: z.number().int(),
	created_at: z.string().datetime(), // snake_case for API contract
}); // types
export type EquipmentCreate = z.infer<typeof equipmentCreateDto>;
export type EquipmentRead = z.infer<typeof equipmentReadDto>;
