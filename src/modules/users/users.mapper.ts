// Approximate type of DB row (adjust if your schema changes)
export type UserRow = {
	id: number;
	name: string;
	role: string;
	email: string;
	password_hash: string; // DB uses snake_case
	isActive: boolean; // DB uses snake_case
	createdAt?: Date | null; // DB uses snake_case
};

// DB row -> API UserRead (snake_case for API contract consistency)
export function toUserRead(u: UserRow) {
	return {
		id: u.id,
		name: u.name,
		role: u.role,
		email: u.email,
		isActive: u.isActive, // Keep snake_case for API contract
		createdAt: u.createdAt, // Keep snake_case for API contract
	};
}
