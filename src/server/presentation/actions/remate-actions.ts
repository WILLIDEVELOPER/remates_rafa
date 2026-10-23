"use server";

import { revalidatePath } from "next/cache";
import type {
  DashboardStatsDto,
  ListRematesOutput,
  RemateDto,
} from "../../application/dtos/remate-dto.ts";
import type { DepartamentoCount } from "../../domain/repositories/remate-repository.ts";
import { CreateRemate } from "../../application/use-cases/create-remate.ts";
import { DeleteRemate } from "../../application/use-cases/delete-remate.ts";
import { ListPublicRemateEntries } from "../../application/use-cases/list-public-remate-entries.ts";
import { GetCoverage } from "../../application/use-cases/get-coverage.ts";
import { GetDashboardStats } from "../../application/use-cases/get-dashboard-stats.ts";
import { GetRelatedRemates } from "../../application/use-cases/get-related-remates.ts";
import { GetRemateById } from "../../application/use-cases/get-remate-by-id.ts";
import { GetRemateBySlug } from "../../application/use-cases/get-remate-by-slug.ts";
import { ListRemates } from "../../application/use-cases/list-remates.ts";
import { SetDestacadoRemate } from "../../application/use-cases/set-destacado.ts";
import { UpdateRemate } from "../../application/use-cases/update-remate.ts";
import { db } from "../../infrastructure/db/client.ts";
import { DrizzleRemateRepository } from "../../infrastructure/repositories/drizzle-remate-repository.ts";
import { requireAdmin } from "../auth/require-admin.ts";
import {
  createRemateSchema,
  listRematesParamsSchema,
  relatedRematesSchema,
  remateIdSchema,
  remateSlugSchema,
  setDestacadoSchema,
  updateRemateSchema,
} from "../validators/remate-schema.ts";
import { fail, ok, type ActionResult } from "./action-result.ts";

const remateRepository = new DrizzleRemateRepository(db);

const createRemate = new CreateRemate(remateRepository);
const updateRemate = new UpdateRemate(remateRepository);
const deleteRemate = new DeleteRemate(remateRepository);
const setDestacado = new SetDestacadoRemate(remateRepository);
const listRemates = new ListRemates(remateRepository);
const getRemateBySlug = new GetRemateBySlug(remateRepository);
const getRemateById = new GetRemateById(remateRepository);
const getRelatedRemates = new GetRelatedRemates(remateRepository);
const getDashboardStats = new GetDashboardStats(remateRepository);
const getCoverage = new GetCoverage(remateRepository);
const listPublicEntries = new ListPublicRemateEntries(remateRepository);

function revalidateRemates(slug?: string) {
  revalidatePath("/");
  revalidatePath("/remates");
  revalidatePath("/admin");
  revalidatePath("/admin/remates");
  if (slug) revalidatePath(`/remates/${slug}`);
}

// ---------------------------------------------------------------------------
// Públicas (solo remates activos)
// ---------------------------------------------------------------------------

export async function listRematesAction(
  params: unknown,
): Promise<ActionResult<ListRematesOutput>> {
  try {
    const input = listRematesParamsSchema.parse(params ?? {});
    return ok(await listRemates.execute({ ...input, activo: true }));
  } catch (error) {
    return fail(error);
  }
}

export async function getFeaturedRematesAction(
  limit = 6,
): Promise<ActionResult<RemateDto[]>> {
  try {
    const { items } = await listRemates.execute({
      destacado: true,
      activo: true,
      pageSize: limit,
    });
    return ok(items);
  } catch (error) {
    return fail(error);
  }
}

export async function getRemateBySlugAction(
  slug: string,
): Promise<ActionResult<RemateDto>> {
  try {
    return ok(await getRemateBySlug.execute(remateSlugSchema.parse(slug)));
  } catch (error) {
    return fail(error);
  }
}

export async function getRelatedRematesAction(
  input: unknown,
): Promise<ActionResult<RemateDto[]>> {
  try {
    return ok(await getRelatedRemates.execute(relatedRematesSchema.parse(input)));
  } catch (error) {
    return fail(error);
  }
}

export async function getSitemapEntriesAction(): Promise<
  ActionResult<{ slug: string; updatedAt: string }[]>
> {
  try {
    return ok(await listPublicEntries.execute());
  } catch (error) {
    return fail(error);
  }
}

export async function getCoverageAction(): Promise<
  ActionResult<DepartamentoCount[]>
> {
  try {
    return ok(await getCoverage.execute());
  } catch (error) {
    return fail(error);
  }
}

// ---------------------------------------------------------------------------
// Administración (requieren sesión de admin)
// ---------------------------------------------------------------------------

export async function adminListRematesAction(
  params: unknown,
): Promise<ActionResult<ListRematesOutput>> {
  try {
    await requireAdmin();
    const input = listRematesParamsSchema.parse(params ?? {});
    return ok(await listRemates.execute(input));
  } catch (error) {
    return fail(error);
  }
}

export async function getRemateByIdAction(
  id: string,
): Promise<ActionResult<RemateDto>> {
  try {
    await requireAdmin();
    return ok(await getRemateById.execute(remateIdSchema.parse(id)));
  } catch (error) {
    return fail(error);
  }
}

export async function getDashboardStatsAction(): Promise<
  ActionResult<DashboardStatsDto>
> {
  try {
    await requireAdmin();
    return ok(await getDashboardStats.execute());
  } catch (error) {
    return fail(error);
  }
}

export async function createRemateAction(
  input: unknown,
): Promise<ActionResult<RemateDto>> {
  try {
    const session = await requireAdmin();
    const remate = await createRemate.execute(
      createRemateSchema.parse(input),
      session.userId,
    );
    revalidateRemates(remate.slug);
    return ok(remate);
  } catch (error) {
    return fail(error);
  }
}

export async function updateRemateAction(
  input: unknown,
): Promise<ActionResult<RemateDto>> {
  try {
    await requireAdmin();
    const remate = await updateRemate.execute(updateRemateSchema.parse(input));
    revalidateRemates(remate.slug);
    return ok(remate);
  } catch (error) {
    return fail(error);
  }
}

export async function deleteRemateAction(
  id: string,
): Promise<ActionResult<RemateDto>> {
  try {
    await requireAdmin();
    const remate = await deleteRemate.execute(remateIdSchema.parse(id));
    revalidateRemates(remate.slug);
    return ok(remate);
  } catch (error) {
    return fail(error);
  }
}

export async function setDestacadoAction(
  input: unknown,
): Promise<ActionResult<RemateDto>> {
  try {
    await requireAdmin();
    const { id, destacado } = setDestacadoSchema.parse(input);
    const remate = await setDestacado.execute(id, destacado);
    revalidateRemates(remate.slug);
    return ok(remate);
  } catch (error) {
    return fail(error);
  }
}
