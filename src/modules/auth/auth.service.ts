import type { JWTPayload } from "jose";
import { jwtVerify, SignJWT } from "jose";
import { env } from "../../config/env.js";

const JWT_SECRET = new TextEncoder().encode(env.SECRET_KEY);
const JWT_ALGORITHM = "HS256";

/**
 * Generate an access token for a user
 */
export async function generateAccessToken(
	userId: number,
	email: string,
): Promise<string> {
	const token = await new SignJWT({
		sub: userId.toString(),
		email: email,
	})
		.setProtectedHeader({ alg: JWT_ALGORITHM })
		.setIssuedAt()
		.setExpirationTime("24h") // Token expires in 24 hours
		.sign(JWT_SECRET);

	return token;
}

/**
 * Verify and decode an access token
 */
export async function verifyAccess(token: string): Promise<JWTPayload> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET, {
			algorithms: [JWT_ALGORITHM],
		});
		return payload;
	} catch {
		throw new Error("Invalid or expired token");
	}
}

/**
 * Generate a refresh token for a user (longer expiration)
 */
export async function generateRefreshToken(userId: number): Promise<string> {
	const token = await new SignJWT({
		sub: userId.toString(),
		type: "refresh",
	})
		.setProtectedHeader({ alg: JWT_ALGORITHM })
		.setIssuedAt()
		.setExpirationTime("7d") // Refresh token expires in 7 days
		.sign(JWT_SECRET);

	return token;
}

/**
 * Verify a refresh token
 */
export async function verifyRefresh(token: string): Promise<JWTPayload> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET, {
			algorithms: [JWT_ALGORITHM],
		});

		if (payload.type !== "refresh") {
			throw new Error("Invalid token type");
		}

		return payload;
	} catch {
		throw new Error("Invalid or expired refresh token");
	}
}

// Export as object for backward compatibility if needed
export const AuthService = {
	generateAccessToken,
	verifyAccess,
	generateRefreshToken,
	verifyRefresh,
};
