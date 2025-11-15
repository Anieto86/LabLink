import {
	type Router as ExpressRouter,
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
// import { requireAuth } from "../auth/requireAuth";
import { equipmentCreateDto, equipmentReadDto } from "./equipment.dtos";
import { toEquipmentRead } from "./equipment.mapper";
import { EquipmentRepo } from "./equipment.repo.js";

export const equipmentRouter: ExpressRouter = Router();

// Extend Request interface for authenticated routes
interface AuthenticatedRequest extends Request {
	user?: { id: number; email: string };
}

equipmentRouter.get(
	"/equipment/:id",
	//!TODO activate the auth later
	// requireAuth,
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const id = Number(req.params.id);
			const row = await EquipmentRepo.findById(id);
			if (!row) return res.status(404).json({ detail: "Equipment not found" });

			// DB row -> mapper -> DTO validation -> response
			const payload = toEquipmentRead(row);
			const data = equipmentReadDto.parse(payload);
			console.log(data);
			return res.json(data);
		} catch (error) {
			next(error);
		}
	}
);

equipmentRouter.post("/equipment", async (req, res, next) => {
	try {
		const input = equipmentCreateDto.parse(req.body); // valida input
		const row = await EquipmentRepo.create(input); // inserta en DB
		const payload = toEquipmentRead(row); // limpia/formatea
		const data = equipmentReadDto.parse(payload); // valida salida
		return res.status(201).json(data);
	} catch (e) {
		next(e);
	}
});
