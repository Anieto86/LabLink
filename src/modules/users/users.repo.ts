import { eq } from "drizzle-orm";
import { db } from "../../infra/db/client.js";
import { users } from "../../infra/db/schema.js";

export const UsersRepo = {
	findById: async (id: number) => {
		const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
		return row ?? null;
	},
	findByEmail: async (email: string) => {
		const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
		return row ?? null;
	},
};
