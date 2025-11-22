import type { InferSelectModel } from "drizzle-orm";
import type { users } from "../../infra/db/schema/users.js";

export type UserRow = InferSelectModel<typeof users>;

export function toUserRead(u: UserRow) {
	return {
		id: u.id,
		name: u.name,
		role: u.role,
		email: u.email,
		isActive: u.isActive,
		createdAt: u.createdAt?.toISOString() ?? new Date().toISOString(),
	};
}
