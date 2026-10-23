"use server";

import { revalidatePath } from "next/cache";
import type {
  ListContactRequestsOutput,
} from "../../application/dtos/contact-request-dto.ts";
import { CreateContactRequest } from "../../application/use-cases/create-contact-request.ts";
import { ListContactRequests } from "../../application/use-cases/list-contact-requests.ts";
import { SetContactRequestRead } from "../../application/use-cases/set-contact-request-read.ts";
import { db } from "../../infrastructure/db/client.ts";
import { DrizzleContactRequestRepository } from "../../infrastructure/repositories/drizzle-contact-request-repository.ts";
import { DrizzleRemateRepository } from "../../infrastructure/repositories/drizzle-remate-repository.ts";
import { requireAdmin } from "../auth/require-admin.ts";
import { contactRequestSchema } from "../validators/contact-schema.ts";
import {
  contactRequestsParamsSchema,
  setContactReadSchema,
} from "../validators/upload-schema.ts";
import { fail, ok, type ActionResult } from "./action-result.ts";

const contactRepository = new DrizzleContactRequestRepository(db);

const createContactRequest = new CreateContactRequest(
  contactRepository,
  new DrizzleRemateRepository(db),
);
const listContactRequests = new ListContactRequests(contactRepository);
const setContactRequestRead = new SetContactRequestRead(contactRepository);

export async function createContactRequestAction(
  input: unknown,
): Promise<ActionResult<{ received: true }>> {
  try {
    const { website, ...data } = contactRequestSchema.parse(input);

    // Honeypot: se responde como éxito para no delatar la trampa a los bots.
    if (website) return ok({ received: true });

    await createContactRequest.execute(data);
    revalidatePath("/admin/solicitudes");
    return ok({ received: true });
  } catch (error) {
    return fail(error);
  }
}

export async function listContactRequestsAction(
  params: unknown,
): Promise<ActionResult<ListContactRequestsOutput>> {
  try {
    await requireAdmin();
    const { pagina, filtro } = contactRequestsParamsSchema.parse(params ?? {});
    return ok(
      await listContactRequests.execute({
        page: pagina,
        onlyUnread: filtro === "sin_leer",
      }),
    );
  } catch (error) {
    return fail(error);
  }
}

export async function getUnreadContactCountAction(): Promise<ActionResult<number>> {
  try {
    await requireAdmin();
    const { unread } = await listContactRequests.execute({ pageSize: 1 });
    return ok(unread);
  } catch (error) {
    return fail(error);
  }
}

export async function setContactRequestReadAction(
  input: unknown,
): Promise<ActionResult<{ id: string; leida: boolean }>> {
  try {
    await requireAdmin();
    const { id, leida } = setContactReadSchema.parse(input);
    const result = await setContactRequestRead.execute(id, leida);
    revalidatePath("/admin/solicitudes");
    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
