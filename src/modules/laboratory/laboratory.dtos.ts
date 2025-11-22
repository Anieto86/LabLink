import { z } from "zod";

export const laboratoryCreateDto = z.object({
	name: z.string().min(2, "Name is required").max(100, "Name is too long"),
	location: z.string().max(200, "Location is too long").optional(),
	capacity: z.number().int().min(0, "Capacity cannot be negative").optional(),
});

export const laboratoryReadDto = laboratoryCreateDto.extend({
	id: z.number().int(),
	createdAt: z.string().datetime(),
});

// types
export type LaboratoryCreate = z.infer<typeof laboratoryCreateDto>;
export type LaboratoryRead = z.infer<typeof laboratoryReadDto>;
