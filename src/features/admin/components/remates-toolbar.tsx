"use client";

import { Button } from "@heroui/react";
import { Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import {
  DebouncedTextField,
  FilterMultiSelect,
  FilterSelect,
} from "@/components/ui/filter-fields";
import { DEPARTAMENTOS, ESTADOS_REMATE_OPTIONS, TIPOS_INMUEBLE_OPTIONS } from "@/lib/colombia";
import { buttonVariants } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useAdminRemateFilters } from "../hooks/use-admin-remate-filters";

const VISIBILITY_OPTIONS = [
  { value: "false", label: "Eliminados" },
  { value: "all", label: "Todos" },
] as const;

const SORT_OPTIONS = [
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
  { value: "fecha_remate", label: "Fecha de remate" },
] as const;

export function RematesToolbar() {
  const { values, activeCount, update, clear } = useAdminRemateFilters();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-md">
          <DebouncedTextField
            label="Buscar"
            placeholder="Nombre o descripción"
            value={values.q}
            onCommit={(q) => update({ q })}
            withSearchIcon
          />
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 ? (
            <Button variant="ghost" size="sm" onPress={clear} className="rounded-full">
              <RotateCcw className="size-3.5" />
              Limpiar ({activeCount})
            </Button>
          ) : null}
          <Link
            href="/admin/remates/nuevo"
            className={cn(buttonVariants({}), "h-10 rounded-full px-5 font-medium")}
          >
            <Plus className="size-4" />
            Nuevo remate
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <FilterSelect
          label="Departamento"
          placeholder="Todos"
          value={values.departamento}
          options={DEPARTAMENTOS.map((value) => ({ value, label: value }))}
          onChange={(departamento) => update({ departamento })}
        />
        <FilterSelect
          label="Estado"
          placeholder="Todos"
          value={values.estado}
          options={ESTADOS_REMATE_OPTIONS}
          onChange={(estado) => update({ estado })}
        />
        <FilterMultiSelect
          label="Tipo de inmueble"
          placeholder="Todos"
          value={values.tipos}
          options={TIPOS_INMUEBLE_OPTIONS}
          onChange={(tipo) => update({ tipo })}
        />
        <FilterSelect
          label="Visibilidad"
          placeholder="Activos"
          value={values.activo}
          options={VISIBILITY_OPTIONS}
          onChange={(activo) => update({ activo })}
        />
        <FilterSelect
          label="Ordenar por"
          placeholder="Más recientes"
          value={values.orden}
          options={SORT_OPTIONS}
          onChange={(orden) => update({ orden })}
        />
      </div>
    </div>
  );
}
