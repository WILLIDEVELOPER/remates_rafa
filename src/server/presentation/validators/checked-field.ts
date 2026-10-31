import { z } from "zod";
import type { Checked } from "../../domain/rules/checked.ts";

/** Aplica una regla del dominio como validación de campo, con su mensaje y su valor normalizado. */
export function checkedField(check: (raw: string) => Checked<string>, maxLength: number) {
  return z
    .string()
    .max(maxLength, "El texto es demasiado largo.")
    .transform((value, ctx) => {
      const result = check(value);
      if (result.ok) return result.value;

      ctx.issues.push({ code: "custom", message: result.error, input: value });
      return z.NEVER;
    });
}
