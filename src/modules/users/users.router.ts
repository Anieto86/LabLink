import type { Router as ExpressRouter, NextFunction, Request, Response } from "express";
import { Router } from "express";
import { requireAuth } from "../auth/requireAuth";
import { userReadDto } from "./users.dtos";
import { toUserRead } from "./users.mapper";
import { UsersRepo } from "./users.repo";

export const usersRouter: ExpressRouter = Router();

// Extend Request interface for authenticated routes
interface AuthenticatedRequest extends Request {
	user?: { id: number; email: string };
}

usersRouter.get(
	"/users/me",
	requireAuth,
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			if (!req.user) {
				return res.status(401).json({ detail: "User not authenticated" });
			}

			const { id } = req.user;
			const row = await UsersRepo.findById(Number(id));
			if (!row || !row.is_active) return res.status(404).json({ detail: "User not found" });

			const payload = toUserRead(row); // maps DB -> public contract
			res.json(userReadDto.parse(payload)); // validates output
		} catch (e) {
			next(e);
		}
	}
);
