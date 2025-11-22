import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UsersRepo } from "../users/users.repo";

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
	const header = req.headers.authorization;
	if (!header?.startsWith("Bearer ")) {
		res.status(401).json({ detail: "Missing token" });
		return;
	}
	try {
		const payload = await AuthService.verifyAccess(header.slice(7));
		const userId = Number(payload.sub);
		if (!Number.isFinite(userId)) throw new Error("Invalid token subject");

		const user = await UsersRepo.findById(userId);
		if (!user || !user.isActive) {
			res.status(401).json({ detail: "User not active" });
			return;
		}

		// Extend Request type to include user
		(req as Request & { user?: { id: number; email: string } }).user = {
			id: userId,
			email: typeof payload.email === "string" ? payload.email : user.email,
		};
		next();
	} catch {
		res.status(401).json({ detail: "Invalid or expired token" });
	}
}
