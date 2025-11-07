import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./modules/auth/auth.router";
import { usersRouter } from "./modules/users/users.router";

export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(usersRouter);
