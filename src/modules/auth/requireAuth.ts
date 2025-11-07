import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
	const header = req.headers.authorization;
	if (!header?.startsWith("Bearer ")) {
		res.status(401).json({ detail: "Missing token" });
		return;
	}
	try {
		const payload = await AuthService.verifyAccess(header.slice(7));
		// Extend Request type to include user
		(req as Request & { user?: { id: number; email: string } }).user = {
			id: Number(payload.sub),
			email: typeof payload.email === "string" ? payload.email : "",
		};
		next();
	} catch {
		res.status(401).json({ detail: "Invalid or expired token" });
	}
}
