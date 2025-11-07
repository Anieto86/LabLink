import type { users } from "../../infra/db/schema";

export const testUsers = {
	regular: {
		name: "John Doe",
		email: "john@example.com",
		passwordHash: "$2b$10$hashedPasswordExample123",
		role: "USER" as const,
		isActive: true,
	},
	admin: {
		name: "Admin User",
		email: "admin@example.com",
		passwordHash: "$2b$10$hashedAdminPasswordExample",
		role: "ADMIN" as const,
		isActive: true,
	},
	inactive: {
		name: "Inactive User",
		email: "inactive@example.com",
		passwordHash: "$2b$10$hashedInactivePassword",
		role: "USER" as const,
		isActive: false,
	},
} satisfies Record<string, typeof users.$inferInsert>;

export const testUserCredentials = {
	regular: {
		email: "john@example.com",
		password: "password123",
	},
	admin: {
		email: "admin@example.com",
		password: "adminPassword123",
	},
	inactive: {
		email: "inactive@example.com",
		password: "inactivePassword123",
	},
};
