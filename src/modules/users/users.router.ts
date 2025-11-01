import { Router } from "express";
import { requireAuth } from "../auth/requireAuth";
import { userReadSchema } from "./users.dtos";
import { toUserRead } from "./users.mapper";
import { UsersRepo } from "./users.repo.js";

export const usersRouter = Router();

usersRouter.get("/users/me", requireAuth, async (req, res, next) => {
	try {
		// biome-ignore lint/suspicious/noExplicitAny: Express request doesn't have typed user property
		const { id } = (req as any).user as { id: number };

		const row = await UsersRepo.findById(Number(id));
		if (!row || !row.isActive)
			return res.status(404).json({ detail: "User not found" });

		const payload = toUserRead(row); // mapea DB -> contrato público
		res.json(userReadSchema.parse(payload)); // valida salida
	} catch (e) {
		next(e);
	}
});
