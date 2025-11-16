/**
 * Environment Variables Configuration for LabLink API
 *
 * This file validates and exports all environment variables used by the application.
 * Uses Zod for runtime validation to ensure all required config is present and valid.
 *
 * Supports two database connection patterns:
 * 1. Single DATABASE_URL (recommended for production)
 * 2. Individual DB_* variables (useful for development)
 */

import { config } from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
config();

// Define and validate environment variable schema
const envSchema = z
	.object({
		// Database connection - individual components (optional if DATABASE_URL provided)
		DB_USER: z.string().optional(),
		DB_PASSWORD: z.string().optional(),
		DB_HOST: z.string().optional(),
		DB_PORT: z.coerce.number().optional().default(5432), // Convert string to number, default to PostgreSQL port
		DB_NAME: z.string().optional(),
		// Security and authentication
		SECRET_KEY: z.string().optional(), // JWT signing secret (can also use JWT_SECRET)
		ACCESS_TOKEN_EXPIRE_MINUTES: z.coerce.number().default(15), // JWT token expiration in minutes
		GOOGLE_CLIENT_ID: z.string().optional(), // For Google OAuth integration
		// Application configuration
		NODE_ENV: z.string().default("development"), // Environment: development, production, test
		PORT: z.coerce.number().default(3000), // Server port number

		// Database connection - single URL (preferred for production)
		DATABASE_URL: z.string().optional(), // Complete PostgreSQL connection string

		// JWT configuration
		JWT_EXPIRES: z.string().default("10m"), // JWT token expiration time format
		JWT_ALG: z.string().default("HS256"), // JWT signing algorithm
	})
	// Custom validation logic - ensures we have valid database configuration
	.superRefine((data, ctx) => {
		// Check if we have a complete database URL
		const hasDatabaseUrl = Boolean(data.DATABASE_URL);

		// Check if we have all individual database connection fields
		const hasAllDbFields =
			Boolean(data.DB_USER) &&
			Boolean(data.DB_PASSWORD) &&
			Boolean(data.DB_HOST) &&
			Boolean(data.DB_NAME);

		// Ensure we have at least one valid database configuration method
		if (!hasDatabaseUrl && !hasAllDbFields) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"Either DATABASE_URL must be set, or DB_USER, DB_PASSWORD, DB_HOST and DB_NAME must be set",
			});
		}

		// Validate JWT signing secret - accepts either SECRET_KEY or JWT_SECRET for flexibility
		const hasSecret = Boolean(data.SECRET_KEY) || Boolean(process.env.JWT_SECRET);
		if (!hasSecret) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "SECRET_KEY (or JWT_SECRET) must be provided for JWT token signing",
			});
		}
	});

// Parse and validate environment variables at startup
// This will throw an error if validation fails, preventing app startup with invalid config
export const env = envSchema.parse(process.env);

// Build unified DATABASE_URL for Drizzle ORM and pg Pool
// Uses provided DATABASE_URL or constructs one from individual DB_* variables
export const DATABASE_URL =
	env.DATABASE_URL ||
	`postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

// Export server port for Express application
export const PORT = env.PORT;
