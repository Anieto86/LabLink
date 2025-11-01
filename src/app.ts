import express from "express";
import { usersRouter } from "./modules/users/users.router.js";

const app = express();

app.use(usersRouter);
