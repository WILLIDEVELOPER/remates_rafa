import { z } from "zod";
import { DomainError } from "../../domain/errors/domain-error.ts";

export type ActionErrorCode =
  | "VALIDATION"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INVALID"
  | "UNAUTHORIZED"
  | "UNKNOWN";

export interface ActionError {
  code: ActionErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail(error: unknown): ActionResult<never> {
  if (error instanceof z.ZodError) {
    const { fieldErrors } = z.flattenError(error) as {
      fieldErrors: Record<string, string[] | undefined>;
    };
    const cleaned: Record<string, string[]> = {};
    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (messages?.length) cleaned[field] = messages;
    }
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: "Revisa los campos del formulario.",
        fieldErrors: cleaned,
      },
    };
  }

  if (error instanceof DomainError) {
    return {
      ok: false,
      error: { code: error.code as ActionErrorCode, message: error.message },
    };
  }

  console.error(error);
  return {
    ok: false,
    error: {
      code: "UNKNOWN",
      message: "Ocurrió un error inesperado. Inténtalo de nuevo.",
    },
  };
}
