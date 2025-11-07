import type {
	Router as ExpressRouter,
	NextFunction,
	Request,
	Response,
} from "express";
import { Router } from "express";
import { requireAuth } from "../auth/requireAuth";
import { userReadSchema } from "./users.dtos";
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
			if (!row || !row.isActive)
				return res.status(404).json({ detail: "User not found" });

			const payload = toUserRead(row); // mapea DB -> contrato público
			res.json(userReadSchema.parse(payload)); // valida salida
		} catch (e) {
			next(e);
		}
	},
);
