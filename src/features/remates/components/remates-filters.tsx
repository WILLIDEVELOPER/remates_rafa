"use client";

import { Button, Card, Drawer, useOverlayState } from "@heroui/react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import {
  ESTADOS_REMATE_OPTIONS,
  getCiudades,
  getMunicipios,
  DEPARTAMENTOS,
  TIPOS_INMUEBLE_OPTIONS,
} from "../constants";
import { useRemateFilters } from "../hooks/use-remate-filters";
import {
  DebouncedTextField,
  FilterMultiSelect,
  FilterSelect,
} from "@/components/ui/filter-fields";

const SORT_OPTIONS = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
  { value: "fecha_remate", label: "Fecha de remate" },
] as const;

const toOptions = (items: readonly string[]) =>
  items.map((item) => ({ value: item, label: item }));

type Filters = ReturnType<typeof useRemateFilters>;

function FilterFields({
  filters,
  includeSearch,
}: {
  filters: Filters;
  includeSearch: boolean;
}) {
  const { values, update } = filters;

  const ciudades = values.departamento ? getCiudades(values.departamento) : [];
  const municipios =
    values.departamento && values.ciudad
      ? getMunicipios(values.departamento, values.ciudad)
      : [];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {includeSearch ? (
        <div className="sm:col-span-2">
          <DebouncedTextField
            label="Buscar"
            placeholder="Nombre o descripción del inmueble"
            value={values.q}
            onCommit={(q) => update({ q })}
            withSearchIcon
          />
        </div>
      ) : null}

      <div className={includeSearch ? "sm:col-span-2" : "sm:col-span-2 lg:col-span-4"}>
        <FilterSelect
          label="Ordenar por"
          placeholder="Más recientes"
          value={values.orden === "recientes" ? undefined : values.orden}
          options={SORT_OPTIONS.filter((option) => option.value !== "recientes")}
          onChange={(orden) => update({ orden })}
        />
      </div>

      <FilterSelect
        label="Departamento"
        placeholder="Todos los departamentos"
        value={values.departamento}
        options={toOptions(DEPARTAMENTOS)}
        onChange={(departamento) =>
          update({ departamento, ciudad: undefined, municipio: undefined })
        }
      />
      <FilterSelect
        label="Ciudad"
        placeholder={
          !values.departamento
            ? "Elige un departamento"
            : ciudades.length === 0
              ? "Sin ciudades registradas"
              : "Todas las ciudades"
        }
        value={values.ciudad}
        options={toOptions(ciudades)}
        isDisabled={ciudades.length === 0}
        onChange={(ciudad) => update({ ciudad, municipio: undefined })}
      />
      <FilterSelect
        label="Municipio"
        placeholder={
          !values.ciudad ? "Elige una ciudad" : "Todos los municipios"
        }
        value={values.municipio}
        options={toOptions(municipios)}
        isDisabled={municipios.length === 0}
        onChange={(municipio) => update({ municipio })}
      />
      <FilterSelect
        label="Estado"
        placeholder="Todos los estados"
        value={values.estado}
        options={ESTADOS_REMATE_OPTIONS}
        onChange={(estado) => update({ estado })}
      />

      <FilterMultiSelect
        label="Tipo de inmueble"
        placeholder="Todos los tipos"
        value={values.tipos}
        options={TIPOS_INMUEBLE_OPTIONS}
        onChange={(tipo) => update({ tipo })}
      />
      <DebouncedTextField
        label="Precio mínimo (COP)"
        placeholder="Ej. 200000000"
        value={values.min}
        inputMode="numeric"
        onCommit={(min) => update({ min })}
      />
      <DebouncedTextField
        label="Precio máximo (COP)"
        placeholder="Ej. 800000000"
        value={values.max}
        inputMode="numeric"
        onCommit={(max) => update({ max })}
      />
    </div>
  );
}

export function RematesFilters() {
  const filters = useRemateFilters();
  const drawer = useOverlayState();
  const { activeCount, clear, values, update } = filters;

  return (
    <div className="flex flex-col gap-4">
      {/* Móvil: búsqueda + drawer de filtros */}
      <div className="flex items-end gap-3 lg:hidden">
        <div className="flex-1">
          <DebouncedTextField
            label="Buscar"
            placeholder="Nombre o descripción"
            value={values.q}
            onCommit={(q) => update({ q })}
            withSearchIcon
          />
        </div>
        <Button variant="outline" onPress={drawer.open} className="h-10 shrink-0 rounded-full px-4">
          <SlidersHorizontal className="size-4" />
          Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      </div>

      <Drawer.Backdrop variant="blur" isOpen={drawer.isOpen} onOpenChange={drawer.setOpen}>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Filtros</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <FilterFields filters={filters} includeSearch={false} />
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" onPress={clear} className="rounded-full">
                Limpiar
              </Button>
              <Button slot="close" className="rounded-full">
                Ver resultados
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>

      {/* Escritorio: barra superior */}
      <Card className="hidden gap-4 rounded-2xl border border-border p-5 shadow-none lg:flex">
        <FilterFields filters={filters} includeSearch />
        {activeCount > 0 ? (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onPress={clear} className="rounded-full">
              <RotateCcw className="size-3.5" />
              Limpiar filtros ({activeCount})
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
