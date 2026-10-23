"use client";

import { useMemo } from "react";
import { splitCsv, useUrlParams } from "@/lib/hooks/use-url-params";

const FILTER_PARAMS = ["q", "departamento", "estado", "tipo", "activo"] as const;

/** Filtros de la tabla de remates del admin, guardados en la URL. */
export function useAdminRemateFilters() {
  const { searchParams, update, clear } = useUrlParams();

  const values = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      departamento: searchParams.get("departamento") ?? undefined,
      estado: splitCsv(searchParams.get("estado"))[0],
      tipos: splitCsv(searchParams.get("tipo")),
      // Sin parámetro = solo activos.
      activo: searchParams.get("activo") ?? undefined,
      orden: searchParams.get("orden") ?? undefined,
    }),
    [searchParams],
  );

  const activeCount = useMemo(
    () => FILTER_PARAMS.filter((param) => searchParams.get(param)).length,
    [searchParams],
  );

  return { values, activeCount, update, clear };
}
