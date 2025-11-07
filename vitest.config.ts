import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./src/test/setup/global-setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"dist/",
				"drizzle/",
				"**/*.config.ts",
				"**/*.d.ts",
				"src/test/",
			],
		},
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
