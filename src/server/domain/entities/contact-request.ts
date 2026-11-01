import { InvalidRemateError } from "../errors/invalid-remate-error.ts";

/** Qué pide quien escribe: información general o la gestión del RUT como postor (DIAN). */
export const SERVICIOS_SOLICITADOS = ["informacion", "gestion_rut"] as const;

export type ServicioSolicitado = (typeof SERVICIOS_SOLICITADOS)[number];

export interface ContactRequest {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  servicio: ServicioSolicitado;
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
