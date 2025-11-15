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

// Load OpenAPI specification
const openApiSpec = JSON.parse(
	readFileSync(join(process.cwd(), "src/openapi/openapi.json"), "utf8")
);

export const app: Express = express();

// Security and CORS
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Documentation
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(openApiSpec, {
		customSiteTitle: "LabLink API Documentation",
		customCss: ".swagger-ui .topbar { display: none }",
		swaggerOptions: {
			persistAuthorization: true,
		},
	})
);

// API Routes
app.use(authRouter);
app.use(usersRouter);
app.use(equipmentRouter);
app.use(errorHandler);

// Health check endpoint
app.get("/health", (_req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});
