export type EquipmentRow = {
	id: number;
	name: string;
	type: string;
	laboratory_id: string; // DB uses snake_case
	status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
	created_at: string; // DB uses snake_case
};

// DB row -> API toEquipmentRead (publiccontract)
export function toEquipmentRead(e: EquipmentRow) {
	return {
		id: e.id,
		name: e.name,
		type: e.type,
		laboratory_id: e.laboratory_id,
		status: e.status,
		created_at: e.created_at,
	};
}
