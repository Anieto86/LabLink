import { env } from "../../config/env.js";
const JWT_SECRET = new TextEncoder().encode(env.SECRET_KEY);
