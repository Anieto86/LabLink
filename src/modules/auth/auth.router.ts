import { Router } from "express";
import { loginDto, refreshDto, registerDto } from "./auth.dto.js";
import { AuthRepo } from "./auth.repo.js";
import { AuthService } from "./auth.service.js";

export const authRouter = Router();

// POST /auth/register
authRouter.post("/auth/register", async (req, res, next) => {
	try {
		const data = registerDto.parse(req.body);
		const exists = await AuthRepo.findByEmail(data.email);
		if (exists)
			return res.status(400).json({ detail: "Email already registered" });

		const user = await AuthRepo.createUser({
			name: data.name,
			role: data.role,
			email: data.email,
			passwordHash: await AuthService.hash(data.password),
		});

		const tokens = await AuthService.issueTokens({
			id: user.id,
			email: user.email,
		});
		res.status(201).json({ id: user.id, email: user.email, ...tokens });
	} catch (e) {
		next(e);
	}
});

// POST /auth/login
authRouter.post("/auth/login", async (req, res, next) => {
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
});

// POST /auth/refresh
authRouter.post("/auth/refresh", async (req, res, next) => {
	try {
		const { refresh_token } = refreshDto.parse(req.body);
		const rotated = await AuthService.rotate(refresh_token);
		if (!rotated)
			return res.status(401).json({ detail: "Invalid refresh token" });
		res.json(rotated);
	} catch (e) {
		next(e);
	}
});

// POST /auth/logout
authRouter.post("/auth/logout", async (req, res, next) => {
	try {
		const { refresh_token } = refreshDto.parse(req.body);
		await AuthService.revoke(refresh_token);
		res.status(204).send();
	} catch (e) {
		next(e);
	}
});
