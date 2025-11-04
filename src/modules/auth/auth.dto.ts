import { z } from "zod";

export const registerDto = z.object({
	name: z.string().min(2).max(50),
	role: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8).max(100),
});

export const loginDto = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const refreshDto = z.object({
	refresh_token: z.string().min(20),
});
