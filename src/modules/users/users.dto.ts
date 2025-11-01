import { z } from "zod";

/** = UserBase */
export const userBaseSchema = z.object({
	name: z.string().min(2, "Name is required").max(50, "Name is too long"),
	role: z.enum(["USER", "ADMIN"]).default("USER"),
	email: z.string().email("Invalid email address"),
});

export const userCreateSchema = userBaseSchema.extend({
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(100, "Password is too long"),
});

/** = UserRead (UserBase + id + is_active) */
export const userReadSchema = userBaseSchema.extend({
	id: z.number().int(),
	is_active: z.boolean(), // note: snake_case to maintain Python contract compatibility
});

/** = UserLogin */
export const userLoginSchema = z.object({
	email: z.string().email(),
	password: z.string(), // length validation already handled in create; free length here
});

// types
export type UserBase = z.infer<typeof userBaseSchema>;
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserRead = z.infer<typeof userReadSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
