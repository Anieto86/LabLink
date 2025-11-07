import { afterAll, beforeAll } from "vitest";
import { db } from "../../infra/db/client";
import { refreshTokens, users } from "../../infra/db/schema";

beforeAll(async () => {
	// Setup test environment
	console.log("🧪 Setting up test environment...");
});

afterAll(async () => {
	// Cleanup test environment
	console.log("🧹 Cleaning up test environment...");
});

export async function setupTestDatabase() {
	// Clean all tables (order matters due to foreign keys)
	await db.delete(refreshTokens);
	await db.delete(users);

	// Insert test data
	await db.insert(users).values([
		{
			name: "Test User",
			email: "test@example.com",
			passwordHash: "hashedPassword123",
			role: "USER",
		},
		{
			name: "Test Admin",
			email: "admin@example.com",
			passwordHash: "hashedPassword123",
			role: "ADMIN",
		},
	]);
}

export async function teardownTestDatabase() {
	await db.delete(refreshTokens);
	await db.delete(users);
}
