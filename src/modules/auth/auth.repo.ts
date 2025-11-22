import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../../infra/db/client.js";
import { refreshTokens, users } from "../../infra/db/schema";

const hashRefreshToken = (token: string) => createHash("sha256").update(token).digest("hex");

export const AuthRepo = {
	// Users
	findByEmail: async (email: string) => {
		const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
		return row ?? null;
	},
	findById: async (id: number) => {
		const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
		return row ?? null;
	},
	createUser: async (data: { name: string; role: string; email: string; passwordHash: string }) => {
		const [row] = await db
			.insert(users)
			.values({
				name: data.name,
				role: data.role as "admin" | "scientist" | "student" | "tech" | "viewer",
				email: data.email,
				passwordHash: data.passwordHash,
			})
			.returning();
		return row;
	},

	// Refresh tokens (opaque)
	insertRefreshToken: async (userId: number, token: string, expiresAt: Date) => {
		const tokenHash = hashRefreshToken(token);
		const [row] = await db
			.insert(refreshTokens)
			.values({ user_id: userId, token: tokenHash, expires_at: expiresAt })
			.returning();
		return row;
	},
	findRefreshToken: async (token: string) => {
		const tokenHash = hashRefreshToken(token);
		const [row] = await db
			.select()
			.from(refreshTokens)
			.where(eq(refreshTokens.token, tokenHash))
			.limit(1);
		return row ?? null;
	},
	revokeRefreshToken: async (token: string) => {
		const tokenHash = hashRefreshToken(token);
		await db
			.update(refreshTokens)
			.set({ is_revoked: true })
			.where(eq(refreshTokens.token, tokenHash));
	},
	rotateRefreshToken: async (prevToken: string, nextToken: string, nextExpiry: Date) => {
		const prevRefreshToken = await AuthRepo.findRefreshToken(prevToken);
		if (!prevRefreshToken) {
			throw new Error("Previous refresh token not found");
		}

		const prevHash = hashRefreshToken(prevToken);
		const nextHash = hashRefreshToken(nextToken);

		await db
			.update(refreshTokens)
			.set({ is_revoked: true, replaced_by_token: nextHash })
			.where(eq(refreshTokens.token, prevHash));
		const [ins] = await db
			.insert(refreshTokens)
			.values({
				user_id: prevRefreshToken.user_id,
				token: nextHash,
				expires_at: nextExpiry,
			})
			.returning();
		if (!ins) {
			throw new Error("Failed to create refresh token");
		}
		return { userId: ins.user_id, next: ins };
	},
};
