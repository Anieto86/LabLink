//Crear clases de error reutilizables  No devuelve respuestas HTTP
export class UnauthorizedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnauthorizedError";
	}
}

export function Unauthorized(message: string) {
	return new UnauthorizedError(message);
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}

export function NotFound(message: string) {
	return new NotFoundError(message);
}

export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ValidationError";
	}
}

export function Validation(message: string) {
	return new ValidationError(message);
}
