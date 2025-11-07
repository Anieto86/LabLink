import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_HOST: z.string(),
	DB_PORT: z.coerce.number().default(5432),
	DB_NAME: z.string(),
	SECRET_KEY: z.string(),
	ACCESS_TOKEN_EXPIRE_MINUTES: z.coerce.number().default(15),
	GOOGLE_CLIENT_ID: z.string(),
	NODE_ENV: z.string().default("development"),
	PORT: z.coerce.number().default(3000),

	// Optional for convenience / production
	DATABASE_URL: z.string().optional(),
	JWT_EXPIRES: z.string().default("10m"),
	JWT_ALG: z.string().default("HS256"),
});

export const env = envSchema.parse(process.env);

// Build unified DB URL for Drizzle / Pool
export const DATABASE_URL =
	env.DATABASE_URL ||
	`postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

// Export commonly used values
export const PORT = env.PORT;
