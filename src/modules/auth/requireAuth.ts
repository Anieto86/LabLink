import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

export async function requireAuth(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const header = req.headers.authorization;
	if (!header?.startsWith("Bearer "))
		return res.status(401).json({ detail: "Missing token" });
	try {
		const payload = await AuthService.verifyAccess(header.slice(7));
		// biome-ignore lint/suspicious/noExplicitAny: Express Request type extension requires any
		(req as any).user = {
			id: Number(payload.sub),
			email: (payload as any).email,
		};
		next();
	} catch {
		res.status(401).json({ detail: "Invalid or expired token" });
	}
}
