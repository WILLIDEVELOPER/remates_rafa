"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type UrlParamsPatch = Record<string, string | string[] | undefined>;

/** Lee y escribe parámetros de búsqueda en la URL para que los filtros se puedan compartir. */
export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (patch: UrlParamsPatch) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(patch)) {
        const serialized = Array.isArray(value) ? value.join(",") : value;
        if (serialized) next.set(key, serialized);
        else next.delete(key);
      }
      // Cualquier cambio de filtro vuelve a la primera página.
      if (!("pagina" in patch)) next.delete("pagina");

      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const clear = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return { searchParams, update, clear };
}

export const splitCsv = (value: string | null): string[] =>
  value ? value.split(",").filter(Boolean) : [];
