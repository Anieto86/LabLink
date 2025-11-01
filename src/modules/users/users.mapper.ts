// Tipo aproximado de la fila en DB (ajustá si tu schema cambia)
export type UserRow = {
	id: number;
	name: string;
	role: string;
	email: string;
	passwordHash: string;
	isActive: boolean;
	createdAt?: Date | null;
};

// DB row -> API UserRead (contrato Python)
export function toUserRead(u: UserRow) {
	return {
		id: u.id,
		name: u.name,
		role: u.role,
		email: u.email,
		is_active: u.isActive,
	};
}
