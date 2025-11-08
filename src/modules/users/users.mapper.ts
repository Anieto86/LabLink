// Approximate type of DB row (adjust if your schema changes)
export type UserRow = {
	id: number;
	name: string;
	role: string;
	email: string;
	password_hash: string; // DB uses snake_case
	is_active: boolean; // DB uses snake_case
	created_at?: Date | null; // DB uses snake_case
};

// DB row -> API UserRead (converts snake_case to API contract)
export function toUserRead(u: UserRow) {
	return {
		id: u.id,
		name: u.name,
		role: u.role,
		email: u.email,
		is_active: u.is_active, // Keep snake_case for API contract consistency
	};
}
