import { createContactRequestAction } from "@/server/presentation/actions/contact-actions";
import type { ContactFormValues } from "../schemas/contact-schema";

export function sendContactRequest(values: ContactFormValues, remateId?: string) {
  return createContactRequestAction({ ...values, remateId: remateId ?? null });
}
