process.env.SECRET_KEY ??= "test-secret";
process.env.DATABASE_URL ??= "postgresql://user:pass@localhost:5432/testdb";

import request from "supertest";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { AuthService } from "../../modules/auth/auth.service.js";
import type { UserRow } from "../../modules/users/users.mapper.js";

const mockAuthRepo = {
	findByEmail: vi.fn(),
	findById: vi.fn(),
	createUser: vi.fn(),
	insertRefreshToken: vi.fn(),
	findRefreshToken: vi.fn(),
	revokeRefreshToken: vi.fn(),
	rotateRefreshToken: vi.fn(),
};

vi.mock("../../modules/auth/auth.repo.js", () => ({
	AuthRepo: mockAuthRepo,
}));

const { app } = await import("../../app.js");

describe("Auth routes", () => {
	const activeUser: UserRow = {
		id: 1,
		name: "John Doe",
		role: "viewer",
		email: "john@example.com",
		passwordHash: "hashed",
		isActive: true,
		createdAt: null,
	};

	beforeEach(() => {
		vi.resetAllMocks();
		mockAuthRepo.findByEmail.mockResolvedValue(activeUser);
		mockAuthRepo.findById.mockResolvedValue(activeUser);
		mockAuthRepo.insertRefreshToken.mockResolvedValue({});
		mockAuthRepo.revokeRefreshToken.mockResolvedValue(undefined);
	});

	it("POST /auth/login returns tokens for valid credentials", async () => {
		vi.spyOn(AuthService, "compare").mockResolvedValue(true);
		const res = await request(app).post("/auth/login").send({
			email: activeUser.email,
			password: "password123",
		});

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("access_token");
		expect(res.body).toHaveProperty("refresh_token");
	});

	it("POST /auth/login rejects invalid credentials", async () => {
		mockAuthRepo.findByEmail.mockResolvedValue(null);
		const res = await request(app).post("/auth/login").send({
			email: "nope@example.com",
			password: "wrong",
		});
		expect(res.status).toBe(401);
	});

	it("POST /auth/refresh rejects invalid refresh token", async () => {
		vi.spyOn(AuthService, "rotate").mockResolvedValue(null);
		const res = await request(app).post("/auth/refresh").send({
			refresh_token: "invalid-token",
		});
		expect(res.status).toBe(401);
	});

	it("POST /auth/logout revokes token", async () => {
		const revokeSpy = vi.spyOn(AuthService, "revoke").mockResolvedValue(undefined);
		const res = await request(app).post("/auth/logout").send({
			refresh_token: "token-to-revoke",
		});
		expect(res.status).toBe(204);
		expect(revokeSpy).toHaveBeenCalledWith("token-to-revoke");
	});
});
