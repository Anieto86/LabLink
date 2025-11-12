import {
	type Router as ExpressRouter,
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import { requireAuth } from "../auth/requireAuth";
import { equipmentReadDto } from "./equipment.dtos";
import { toEquipmentRead } from "./equipment.mapper";
import { EquipmentRepo } from "./equipment.repo.js";

export const equipmentRouter: ExpressRouter = Router();

// Extend Request interface for authenticated routes
interface AuthenticatedRequest extends Request {
	user?: { id: number; email: string };
}

equipmentRouter.get(
	"/equipment/:id",
	requireAuth,
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const id = Number(req.params.id);
			const row = await EquipmentRepo.findById(id);
			if (!row) return res.status(404).json({ detail: "Equipment not found" });

			// DB row -> mapper -> DTO validation -> response
			const payload = toEquipmentRead(row);
			const data = equipmentReadDto.parse(payload);

			return res.json(data);
		} catch (error) {
			next(error);
		}
	}
);
