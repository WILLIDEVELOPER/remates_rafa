import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";

const MAX_ATTEMPTS = 50;

/** Devuelve `base`, o `base-2`, `base-3`... hasta encontrar un slug libre. */
export async function findAvailableSlug(
  remates: RemateRepository,
  base: string,
): Promise<string> {
  const root = base || "remate";

  if (!(await remates.slugExists(root))) return root;

  for (let suffix = 2; suffix <= MAX_ATTEMPTS; suffix++) {
    const candidate = `${root.slice(0, 160 - String(suffix).length - 1)}-${suffix}`;
    if (!(await remates.slugExists(candidate))) return candidate;
  }

  return `${root.slice(0, 140)}-${crypto.randomUUID().slice(0, 8)}`;
}
