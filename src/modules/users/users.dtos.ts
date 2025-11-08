import { z } from "zod";

/** = UserBase */
export const userBaseDto = z.object({
	name: z.string().min(2, "Name is required").max(50, "Name is too long"),
	role: z.enum(["USER", "ADMIN"]).default("USER"),
	email: z.string().email("Invalid email address"),
});

export const userCreateDto = userBaseDto.extend({
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(100, "Password is too long"),
});

/** = UserRead (UserBase + id + is_active + created_at) */
export const userReadDto = userBaseDto.extend({
	id: z.number().int(),
	is_active: z.boolean(), // snake_case for API contract
	created_at: z.date().optional().nullable(), // snake_case for API contract
});

/** = UserLogin */
export const userLoginDto = z.object({
	email: z.string().email(),
	password: z.string(), // length validation already handled in create; free length here
});

// types
export type UserBase = z.infer<typeof userBaseDto>;
export type UserCreate = z.infer<typeof userCreateDto>;
export type UserRead = z.infer<typeof userReadDto>;
export type UserLogin = z.infer<typeof userLoginDto>;
