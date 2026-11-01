"use client";

import { useMemo } from "react";
import { splitCsv, useUrlParams } from "@/lib/hooks/use-url-params";

const FILTER_PARAMS = [
  "q",
  "departamento",
  "ciudad",
  "municipio",
  "tipo",
  "entidad",
  "estado",
  "min",
  "max",
] as const;

/** Filtros del listado público, guardados en la URL. */
export function useRemateFilters() {
  const { searchParams, update, clear } = useUrlParams();

  const values = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      departamento: searchParams.get("departamento") ?? undefined,
      ciudad: searchParams.get("ciudad") ?? undefined,
      municipio: searchParams.get("municipio") ?? undefined,
      tipos: splitCsv(searchParams.get("tipo")),
      entidad: splitCsv(searchParams.get("entidad"))[0],
      estado: splitCsv(searchParams.get("estado"))[0],
      min: searchParams.get("min") ?? "",
      max: searchParams.get("max") ?? "",
      orden: searchParams.get("orden") ?? "recientes",
    }),
    [searchParams],
  );

  const activeCount = useMemo(
    () => FILTER_PARAMS.filter((param) => searchParams.get(param)).length,
    [searchParams],
  );

  return { values, activeCount, update, clear };
}
