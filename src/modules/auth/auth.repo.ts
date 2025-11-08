import { eq } from "drizzle-orm";
import { db } from "../../infra/db/client.js";
import { refreshTokens, users } from "../../infra/db/schema";

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
				role: data.role,
				email: data.email,
				password_hash: data.passwordHash,
			})
			.returning();
		return row;
	},

	// Refresh tokens (opaque)
	insertRefreshToken: async (userId: number, token: string, expiresAt: Date) => {
		const [row] = await db
			.insert(refreshTokens)
			.values({ user_id: userId, token, expires_at: expiresAt })
			.returning();
		return row;
	},
	findRefreshToken: async (token: string) => {
		const [row] = await db
			.select()
			.from(refreshTokens)
			.where(eq(refreshTokens.token, token))
			.limit(1);
		return row ?? null;
	},
	revokeRefreshToken: async (token: string) => {
		await db.update(refreshTokens).set({ is_revoked: true }).where(eq(refreshTokens.token, token));
	},
	rotateRefreshToken: async (prevToken: string, nextToken: string, nextExpiry: Date) => {
		const prevRefreshToken = await AuthRepo.findRefreshToken(prevToken);
		if (!prevRefreshToken) {
			throw new Error("Previous refresh token not found");
		}

		await db
			.update(refreshTokens)
			.set({ is_revoked: true, replaced_by_token: nextToken })
			.where(eq(refreshTokens.token, prevToken));
		const [ins] = await db
			.insert(refreshTokens)
			.values({
				user_id: prevRefreshToken.user_id,
				token: nextToken,
				expires_at: nextExpiry,
			})
			.returning();
		if (!ins) {
			throw new Error("Failed to create refresh token");
		}
		return { userId: ins.user_id, next: ins };
	},
};
