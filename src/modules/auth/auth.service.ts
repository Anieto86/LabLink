import * as bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { env } from "../../config/env.js";
import { AuthRepo } from "./auth.repo.js";

const SECRET = new TextEncoder().encode(env.SECRET_KEY ?? process.env.JWT_SECRET_DEFAULT);
const ALG = (env.JWT_ALG || "HS256") as "HS256" | "HS384" | "HS512";
const ACCESS_TTL = env.JWT_EXPIRES || "10m";
const REFRESH_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7d

export const AuthService = {
	hash: (pwd: string) => bcrypt.hash(pwd, 10),
	compare: (pwd: string, hash: string) => bcrypt.compare(pwd, hash),

	signAccess: (payload: Record<string, unknown>) =>
		new SignJWT(payload)
			.setProtectedHeader({ alg: ALG })
			.setExpirationTime(ACCESS_TTL)
			.sign(SECRET),

	verifyAccess: async (token: string) => (await jwtVerify(token, SECRET)).payload,

	genRefresh(): string {
		return `${crypto.randomUUID()}.${crypto.randomUUID()}`;
	},
	refreshExpiry(): Date {
		return new Date(Date.now() + REFRESH_TTL_MS);
	},

	async issueTokens(user: { id: number; email: string }) {
		const access_token = await this.signAccess({
			sub: user.id,
			email: user.email,
		});
		const refresh_token = this.genRefresh();
		await AuthRepo.insertRefreshToken(user.id, refresh_token, this.refreshExpiry());
		return { access_token, refresh_token };
	},

	async rotate(prevToken: string) {
		const stored = await AuthRepo.findRefreshToken(prevToken);
		if (!stored || stored.is_revoked || stored.expires_at <= new Date()) return null;
		const next = this.genRefresh();
		const rotated = await AuthRepo.rotateRefreshToken(prevToken, next, this.refreshExpiry());
		const user = await AuthRepo.findById(rotated.userId);
		if (!user || !user.isActive) return null;
		const access_token = await this.signAccess({
			sub: user.id,
			email: user.email,
		});
		return { access_token, refresh_token: next };
	},

	async revoke(refreshToken: string) {
		await AuthRepo.revokeRefreshToken(refreshToken);
	},
};
