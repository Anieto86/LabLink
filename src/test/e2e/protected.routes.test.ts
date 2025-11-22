process.env.SECRET_KEY ??= "test-secret";
process.env.DATABASE_URL ??= "postgresql://user:pass@localhost:5432/testdb";

import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UserRow } from "../../modules/users/users.mapper.js";

const mockUsersRepo = {
	findById: vi.fn(),
};

const mockAuthService = {
	verifyAccess: vi.fn(),
};

vi.mock("../../modules/users/users.repo.js", () => ({
	UsersRepo: mockUsersRepo,
}));

vi.mock("../../modules/auth/auth.service.js", async () => {
	const actual = await vi.importActual<typeof import("../../modules/auth/auth.service.js")>(
		"../../modules/auth/auth.service.js"
	);
	return {
		...actual,
		AuthService: { ...actual.AuthService, verifyAccess: mockAuthService.verifyAccess },
	};
});

const { app } = await import("../../app.js");

describe("Protected routes (/users/me)", () => {
	const baseUser: UserRow = {
		id: 42,
		name: "Jane Doe",
		role: "viewer",
		email: "jane@example.com",
		passwordHash: "hash",
		isActive: true,
		createdAt: new Date("2024-01-01T00:00:00.000Z"),
	};

	beforeEach(() => {
		vi.resetAllMocks();
		mockAuthService.verifyAccess.mockResolvedValue({ sub: baseUser.id, email: baseUser.email });
	});

	it("returns 401 when user is inactive", async () => {
		mockUsersRepo.findById.mockResolvedValue({ ...baseUser, isActive: false });
		const res = await request(app).get("/users/me").set("Authorization", "Bearer valid-token");
		expect(res.status).toBe(401);
		expect(res.body.detail).toMatch(/not active/i);
	});

	it("returns user data when active", async () => {
		mockUsersRepo.findById.mockResolvedValue(baseUser);
		const res = await request(app).get("/users/me").set("Authorization", "Bearer valid-token");
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject({
			id: baseUser.id,
			email: baseUser.email,
			isActive: true,
		});
	});
});
