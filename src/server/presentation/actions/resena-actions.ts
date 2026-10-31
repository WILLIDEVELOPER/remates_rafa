"use server";

import { revalidatePath } from "next/cache";
import type {
  AdminResenaDto,
  ListResenasOutput,
  PublicResenaDto,
} from "../../application/dtos/resena-dto.ts";
import { CreateResena } from "../../application/use-cases/create-resena.ts";
import { DeleteResena } from "../../application/use-cases/delete-resena.ts";
import { ListAdminResenas } from "../../application/use-cases/list-admin-resenas.ts";
import { ListPublicResenas } from "../../application/use-cases/list-public-resenas.ts";
import { UpdateResena } from "../../application/use-cases/update-resena.ts";
import { db } from "../../infrastructure/db/client.ts";
import { DrizzleRemateRepository } from "../../infrastructure/repositories/drizzle-remate-repository.ts";
import { DrizzleResenaRepository } from "../../infrastructure/repositories/drizzle-resena-repository.ts";
import { requireAdmin } from "../auth/require-admin.ts";
import {
  createResenaSchema,
  remateResenasIdSchema,
  resenaIdSchema,
  updateResenaSchema,
} from "../validators/resena-schema.ts";
import { fail, ok, type ActionResult } from "./action-result.ts";

const resenaRepository = new DrizzleResenaRepository(db);

const createResena = new CreateResena(resenaRepository, new DrizzleRemateRepository(db));
const listPublicResenas = new ListPublicResenas(resenaRepository);
const listAdminResenas = new ListAdminResenas(resenaRepository);
const updateResena = new UpdateResena(resenaRepository);
const deleteResena = new DeleteResena(resenaRepository);

/** Las reseñas se pintan en el detalle de cualquier remate: se refrescan todos. */
function revalidateResenas() {
  revalidatePath("/remates/[slug]", "page");
  revalidatePath("/admin/remates/[id]/editar", "page");
}

// ---------------------------------------------------------------------------
// Públicas
// ---------------------------------------------------------------------------

export async function listPublicResenasAction(
  remateId: string,
): Promise<ActionResult<ListResenasOutput<PublicResenaDto>>> {
  try {
    return ok(await listPublicResenas.execute(remateResenasIdSchema.parse(remateId)));
  } catch (error) {
    return fail(error);
  }
}

export async function createResenaAction(
  input: unknown,
): Promise<ActionResult<{ received: true }>> {
  try {
    const { website, ...data } = createResenaSchema.parse(input);

    // Honeypot: se responde como éxito para no delatar la trampa a los bots.
    if (website) return ok({ received: true });

    await createResena.execute(data);
    revalidateResenas();
    return ok({ received: true });
  } catch (error) {
    return fail(error);
  }
}

// ---------------------------------------------------------------------------
// Administración (requieren sesión de admin)
// ---------------------------------------------------------------------------

export async function adminListResenasAction(
  remateId: string,
): Promise<ActionResult<ListResenasOutput<AdminResenaDto>>> {
  try {
    await requireAdmin();
    return ok(await listAdminResenas.execute(remateResenasIdSchema.parse(remateId)));
  } catch (error) {
    return fail(error);
  }
}

export async function updateResenaAction(
  input: unknown,
): Promise<ActionResult<AdminResenaDto>> {
  try {
    await requireAdmin();
    const resena = await updateResena.execute(updateResenaSchema.parse(input));
    revalidateResenas();
    return ok(resena);
  } catch (error) {
    return fail(error);
  }
}

export async function deleteResenaAction(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const resenaId = resenaIdSchema.parse(id);
    await deleteResena.execute(resenaId);
    revalidateResenas();
    return ok({ id: resenaId });
  } catch (error) {
    return fail(error);
  }
}
