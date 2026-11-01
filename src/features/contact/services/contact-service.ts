import { createContactRequestAction } from "@/server/presentation/actions/contact-actions";
import type { ServicioSolicitado } from "@/server/domain/entities/contact-request";
import type { ContactFormValues } from "../schemas/contact-schema";

export function sendContactRequest(
  values: ContactFormValues,
  remateId?: string,
  servicio: ServicioSolicitado = "informacion",
) {
  return createContactRequestAction({ ...values, remateId: remateId ?? null, servicio });
}
