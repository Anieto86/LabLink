/**
 * Main Express application configuration for LabLink API
 * Sets up middleware, routes, security, and API documentation
 */

// biome-ignore assist/source/organizeImports: imports organized manually for readability
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./common/middlewares/errorHandler.js";
import { authRouter } from "./modules/auth/auth.router";
import { equipmentRouter } from "./modules/equipment/equipment.router";
import { usersRouter } from "./modules/users/users.router";

// Load OpenAPI specification for Swagger UI documentation
const openApiSpec = JSON.parse(
	readFileSync(join(process.cwd(), "src/openapi/openapi.json"), "utf8")
);

// Initialize Express application instance
export const app: Express = express();

// Security and CORS middleware configuration
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Documentation - Swagger UI setup with custom configuration
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(openApiSpec, {
		customSiteTitle: "LabLink API Documentation", // Custom page title
		customCss: ".swagger-ui .topbar { display: none }", // Hide default topbar
		swaggerOptions: {
			persistAuthorization: true, // Remember auth tokens across page reloads
		},
	})
);

// API Routes registration - Order matters for middleware precedence
app.use(authRouter); // Authentication endpoints (/auth/*)
app.use(usersRouter); // User management endpoints (/users/*)
app.use(equipmentRouter); // Equipment management endpoints (/equipment/*)
app.use(errorHandler); // Global error handling middleware (must be last)

// Health check endpoint - Used for monitoring and load balancer health checks
app.get("/health", (_req, res) => {
	res.json({
		status: "OK", // Application status indicator
		timestamp: new Date().toISOString(), // Current server time
		uptime: process.uptime(), // Server uptime in seconds
	});
});
