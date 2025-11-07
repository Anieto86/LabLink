import type {
	Router as ExpressRouter,
	NextFunction,
	Request,
	Response,
} from "express";
import { Router } from "express";
import { loginDto, refreshDto, registerDto } from "./auth.dto.js";
import { AuthRepo } from "./auth.repo.js";
import { AuthService } from "./auth.service.js";

export const authRouter: ExpressRouter = Router();

// POST /auth/register
authRouter.post(
	"/auth/register",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = registerDto.parse(req.body);
			const exists = await AuthRepo.findByEmail(data.email);
			if (exists) {
				res.status(400).json({ detail: "Email already registered" });
				return;
			}

			const user = await AuthRepo.createUser({
				name: data.name,
				role: data.role,
				email: data.email,
				passwordHash: await AuthService.hash(data.password),
			});

			if (!user) {
				res.status(500).json({ detail: "Failed to create user" });
				return;
			}

			const tokens = await AuthService.issueTokens({
				id: user.id,
				email: user.email,
			});
			res.status(201).json({ id: user.id, email: user.email, ...tokens });
		} catch (e) {
			next(e);
		}
	},
);

// POST /auth/login
authRouter.post(
	"/auth/login",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = loginDto.parse(req.body);
			const user = await AuthRepo.findByEmail(email);
			if (!user || !user.isActive)
				return res.status(401).json({ detail: "Invalid credentials" });
			const ok = await AuthService.compare(password, user.passwordHash);
			if (!ok) return res.status(401).json({ detail: "Invalid credentials" });

			const tokens = await AuthService.issueTokens({
				id: user.id,
				email: user.email,
			});
			res.json(tokens);
		} catch (e) {
			next(e);
		}
	},
);

// POST /auth/refresh
authRouter.post(
	"/auth/refresh",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { refresh_token } = refreshDto.parse(req.body);
			const rotated = await AuthService.rotate(refresh_token);
			if (!rotated)
				return res.status(401).json({ detail: "Invalid refresh token" });
			res.json(rotated);
		} catch (e) {
			next(e);
		}
	},
);

// POST /auth/logout
authRouter.post(
	"/auth/logout",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { refresh_token } = refreshDto.parse(req.body);
			await AuthService.revoke(refresh_token);
			res.status(204).send();
		} catch (e) {
			next(e);
		}
	},
);
