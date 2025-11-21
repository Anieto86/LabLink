// Approximate type of DB row (adjust if your schema changes)
export type UserRow = {
	id: number;
	name: string;
	role: "admin" | "scientist" | "student" | "tech" | "viewer" | null;
	email: string;
	passwordHash: string; // Drizzle maps to camelCase
	isActive: boolean; // Drizzle maps to camelCase
	createdAt?: Date | null; // Drizzle maps to camelCase
};

// DB row -> API UserRead (camelCase for API contract consistency)
export function toUserRead(u: UserRow) {
	return {
		id: u.id,
		name: u.name,
		role: u.role,
		email: u.email,
		isActive: u.isActive,
		createdAt: u.createdAt ? u.createdAt.toISOString() : null,
	};
}
