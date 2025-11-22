import type { Router as ExpressRouter, NextFunction, Request, Response } from "express";
import { Router } from "express";
import { laboratoryCreateDto } from "./laboratory.dtos";
import { toLaboratoryRead } from "./laboratory.mapper";
import { LaboratoriesRepo } from "./laboratory.repo.js";

export const laboratoryRouter: ExpressRouter = Router();

// Extend Request interface for authenticated routes
interface AuthenticatedRequest extends Request {
	user?: { id: number; email: string };
}

laboratoryRouter.get(
	"/laboratories/:id",
	// requireAuth,
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const id = Number(req.params.id);
			const row = await LaboratoriesRepo.findById(id);
			if (!row) return res.status(404).json({ detail: "Laboratory not found" });
			const payload = toLaboratoryRead(row);
			const data = laboratoryCreateDto.parse(payload);
			console.log(data);
			return res.json(data);
		} catch (error) {
			next(error);
		}
	}
);

laboratoryRouter.post(
	"/laboratories",
	// requireAuth,  curl -X POST http://localhost:PORT/laboratories ...
	async (req, res, next) => {
		try {
			const input = laboratoryCreateDto.parse(req.body);
			const row = await LaboratoriesRepo.create(input);
			const payload = toLaboratoryRead(row);
			const data = laboratoryCreateDto.parse(payload);
			return res.status(201).json(data);
		} catch (e) {
			next(e);
		}
	}
);
