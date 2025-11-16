import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z
	.object({
		DB_USER: z.string().optional(),
		DB_PASSWORD: z.string().optional(),
		DB_HOST: z.string().optional(),
		DB_PORT: z.coerce.number().optional().default(5432),
		DB_NAME: z.string().optional(),
		SECRET_KEY: z.string().optional(),
		ACCESS_TOKEN_EXPIRE_MINUTES: z.coerce.number().default(15),
		GOOGLE_CLIENT_ID: z.string().optional(),
		NODE_ENV: z.string().default("development"),
		PORT: z.coerce.number().default(3000),

		// Optional for convenience / production
		DATABASE_URL: z.string().optional(),
		JWT_EXPIRES: z.string().default("10m"),
		JWT_ALG: z.string().default("HS256"),
	})
	.superRefine((data, ctx) => {
		const hasDatabaseUrl = Boolean(data.DATABASE_URL);
		const hasAllDbFields =
			Boolean(data.DB_USER) &&
			Boolean(data.DB_PASSWORD) &&
			Boolean(data.DB_HOST) &&
			Boolean(data.DB_NAME);

		if (!hasDatabaseUrl && !hasAllDbFields) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"Either DATABASE_URL must be set, or DB_USER, DB_PASSWORD, DB_HOST and DB_NAME must be set",
			});
		}

		// Allow JWT_SECRET as an alias for SECRET_KEY in env
		const hasSecret = Boolean(data.SECRET_KEY) || Boolean(process.env.JWT_SECRET);
		if (!hasSecret) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "SECRET_KEY (or JWT_SECRET) must be provided",
			});
		}
	});

export const env = envSchema.parse(process.env);

// Build unified DB URL for Drizzle / Pool
export const DATABASE_URL =
	env.DATABASE_URL ||
	`postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

export const PORT = env.PORT;
