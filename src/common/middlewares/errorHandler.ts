//Procesar y mapear excepciones a respuestas 4xx/5xx , No define tipos de error
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../../config/logger.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../http/errors.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	// Zod
	if (err instanceof ZodError) {
		return res.status(400).json({
			detail: "Validation error",
			issues: err.issues,
		});
	}
	// 2) Custom semantic errors
	if (err instanceof NotFoundError) {
		return res.status(404).json({ detail: err.message });
	}

	if (err instanceof UnauthorizedError) {
		return res.status(401).json({ detail: err.message });
	}

	if (err instanceof ValidationError) {
		return res.status(400).json({ detail: err.message });
	}

	// 3) Fallas inesperadas
	logger.error({ err }, "Unhandled error");

	return res.status(500).json({
		detail: "Internal server error",
	});
};
