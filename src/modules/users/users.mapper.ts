// Approximate type of DB row (adjust if your schema changes)
export type UserRow = {
	id: number;
	name: string;
	role: string;
	email: string;
	passwordHash: string;
	isActive: boolean;
	createdAt?: Date | null;
};

// DB row -> API UserRead (Python contract)
export function toUserRead(u: UserRow) {
	return {
		id: u.id,
		name: u.name,
		role: u.role,
		email: u.email,
		is_active: u.isActive,
	};
}
