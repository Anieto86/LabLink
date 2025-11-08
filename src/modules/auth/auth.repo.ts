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
		const [row] = await db.insert(users).values(data).returning();
		return row;
	},

	// Refresh tokens (opaque)
	insertRefreshToken: async (userId: number, token: string, expiresAt: Date) => {
		const [row] = await db.insert(refreshTokens).values({ userId, token, expiresAt }).returning();
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
		await db.update(refreshTokens).set({ isRevoked: true }).where(eq(refreshTokens.token, token));
	},
	rotateRefreshToken: async (prevToken: string, nextToken: string, nextExpiry: Date) => {
		const prevRefreshToken = await AuthRepo.findRefreshToken(prevToken);
		if (!prevRefreshToken) {
			throw new Error("Previous refresh token not found");
		}

		await db
			.update(refreshTokens)
			.set({ isRevoked: true, replacedByToken: nextToken })
			.where(eq(refreshTokens.token, prevToken));
		const [ins] = await db
			.insert(refreshTokens)
			.values({
				userId: prevRefreshToken.userId,
				token: nextToken,
				expiresAt: nextExpiry,
			})
			.returning();
		if (!ins) {
			throw new Error("Failed to create refresh token");
		}
		return { userId: ins.userId, next: ins };
	},
};
