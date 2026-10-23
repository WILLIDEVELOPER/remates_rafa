import { InvalidRemateError } from "../errors/invalid-remate-error.ts";

export interface ContactRequest {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  remateId: string | null;
  leida: boolean;
  createdAt: Date;
}

export interface ContactRequestWithRemate extends ContactRequest {
  remateNombre: string | null;
  remateSlug: string | null;
}

export type NewContactRequest = Omit<ContactRequest, "id" | "createdAt" | "leida">;

export function assertContactRequestRules(
  request: Pick<NewContactRequest, "nombre" | "email" | "mensaje">,
): void {
  if (!request.nombre.trim()) {
    throw new InvalidRemateError("Indica tu nombre.");
  }
  if (!request.email.includes("@")) {
    throw new InvalidRemateError("El correo electrónico no es válido.");
  }
  if (request.mensaje.trim().length < 10) {
    throw new InvalidRemateError("El mensaje es demasiado corto.");
  }
}
