import type { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../../common/http/errors";
import { AuthService } from "./auth.service";

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
		// biome-ignore lint/suspicious/noExplicitAny: extending Request object with user property
		(req as any).user = {
			id: Number(payload.sub),
			email: payload.email,
		};
		next();
	} catch {
		next(Unauthorized("Invalid or expired token"));
	}
}
