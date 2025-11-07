import { app } from "./app.js";
import { PORT } from "./config/env.js";
import { logger } from "./config/logger.js";

const server = app.listen(PORT, () => {
	logger.info(`🚀 Server running on http://localhost:${PORT}`);
	logger.info(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
	logger.info(`💊 Health Check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
	logger.info("SIGTERM received, shutting down gracefully");
	server.close(() => {
		logger.info("Process terminated");
		process.exit(0);
	});
});

process.on("SIGINT", () => {
	logger.info("SIGINT received, shutting down gracefully");
	server.close(() => {
		logger.info("Process terminated");
		process.exit(0);
	});
});
