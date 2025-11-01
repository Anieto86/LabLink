export class UnauthorizedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnauthorizedError";
	}
}

export function Unauthorized(message: string) {
	return new UnauthorizedError(message);
}
