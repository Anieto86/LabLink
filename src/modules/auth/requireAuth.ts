import type { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../../common/http/errors.js";
import { AuthService } from "./../auth/auth.service.js";

export async function requireAuth(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	const header = req.headers.authorization;
	if (!header?.startsWith("Bearer "))
		return next(Unauthorized("Missing token"));
	try {
		const payload = await AuthService.verifyAccess(header.slice(7));
		// biome-ignore lint/suspicious/noExplicitAny:
		(req as any).user = {
			id: Number(payload.sub),
			email: (payload as any).email,
		};
		next();
	} catch {
		next(Unauthorized("Invalid or expired token"));
	}
}
