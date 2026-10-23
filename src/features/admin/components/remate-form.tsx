"use client";

import { Accordion, Alert, Button, Label, Spinner, Switch } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Controller, useWatch } from "react-hook-form";
import {
  DEPARTAMENTOS,
  ESTADOS_REMATE_OPTIONS,
  getCiudades,
  getMunicipios,
  TIPOS_INMUEBLE_OPTIONS,
} from "@/lib/colombia";
import { slugify } from "@/lib/slug";
import type { RemateDto } from "@/server/application/dtos/remate-dto";
import { useRemateForm } from "../hooks/use-remate-form";
import { FormNumber, FormSelect, FormText, FormTextArea } from "./form-fields";
import { ImageUploader } from "./image-uploader";

const toOptions = (items: readonly string[]) => items.map((value) => ({ value, label: value }));

/** Incluye el valor actual aunque no esté en la lista de referencia (datos existentes). */
const withCurrent = (items: readonly string[], current: string) =>
  current && !items.includes(current) ? [...items, current] : [...items];

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <Accordion.Item id={id}>
      <Accordion.Heading level={2}>
        <Accordion.Trigger className="py-4">
          <span className="flex flex-col items-start gap-0.5 text-left">
            <span className="text-base font-medium tracking-tight">{title}</span>
            <span className="text-xs font-normal text-muted">{description}</span>
          </span>
          <Accordion.Indicator>
            <ChevronDown />
          </Accordion.Indicator>
        </Accordion.Trigger>
      </Accordion.Heading>
      <Accordion.Panel>
        <Accordion.Body className="pb-6">{children}</Accordion.Body>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export function RemateForm({ remate }: { remate?: RemateDto }) {
  const {
    form,
    isEdit,
    onSubmit,
    isUploading,
    setIsUploading,
    expanded,
    setExpanded,
    slugTouched,
    setSlugTouched,
  } = useRemateForm({ remate });
  const { control, setValue, formState } = form;

  const departamento = useWatch({ control, name: "departamento" });
  const ciudad = useWatch({ control, name: "ciudad" });
  const municipio = useWatch({ control, name: "municipio" });

  // Solo hay datos de referencia para algunos departamentos; en el resto se escribe a mano.
  const ciudades = withCurrent(getCiudades(departamento), ciudad);
  const hasCiudadList = getCiudades(departamento).length > 0;
  const municipios = getMunicipios(departamento, ciudad);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {remate && !remate.activo ? (
        <Alert status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Este remate está eliminado</Alert.Title>
            <Alert.Description>
              No es visible en el sitio. Puedes restaurarlo desde la lista de remates (filtro &ldquo;Eliminados&rdquo;).
            </Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      <Accordion
        allowsMultipleExpanded
        variant="surface"
        expandedKeys={expanded}
        onExpandedChange={(keys) => setExpanded(new Set(keys))}
        className="w-full"
      >
        <Section id="general" title="Información general" description="Nombre, descripción, tipo y estado del remate.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormText
                control={control}
                name="nombre"
                label="Nombre del remate"
                placeholder="Casa campestre en El Poblado"
                required
                onValueChange={(value) => {
                  if (!slugTouched) setValue("slug", slugify(value), { shouldValidate: formState.isSubmitted });
                }}
              />
            </div>
            <div className="md:col-span-2">
              <FormText
                control={control}
                name="slug"
                label="Slug (URL)"
                placeholder="se-genera-desde-el-nombre"
                prefix="/remates/"
                onValueChange={(value) => setSlugTouched(value !== "")}
              />
            </div>
            <div className="md:col-span-2">
              <FormTextArea control={control} name="descripcion" label="Descripción" placeholder="Describe el inmueble, su estado jurídico y sus ventajas." />
            </div>
            <FormSelect control={control} name="tipoInmueble" label="Tipo de inmueble" placeholder="Selecciona un tipo" options={TIPOS_INMUEBLE_OPTIONS} required />
            <FormSelect control={control} name="estado" label="Estado" placeholder="Selecciona un estado" options={ESTADOS_REMATE_OPTIONS} required />
            <FormText control={control} name="fechaRemate" label="Fecha y hora del remate (hora de Colombia)" type="datetime-local" />
            <Controller
              control={control}
              name="destacado"
              render={({ field }) => (
                <div className="flex items-end pb-2">
                  <Switch isSelected={field.value} onChange={field.onChange}>
                    <Switch.Content>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Label>Mostrar como destacado en la landing</Label>
                    </Switch.Content>
                  </Switch>
                </div>
              )}
            />
          </div>
        </Section>

        <Section id="ubicacion" title="Ubicación" description="Departamento, ciudad, municipio y dirección de referencia.">
          <div className="grid gap-4 md:grid-cols-3">
            <FormSelect
              control={control}
              name="departamento"
              label="Departamento"
              placeholder="Selecciona un departamento"
              options={toOptions(withCurrent(DEPARTAMENTOS, departamento))}
              required
              onValueChange={() => {
                setValue("ciudad", "");
                setValue("municipio", "");
              }}
            />
            {hasCiudadList ? (
              <FormSelect
                control={control}
                name="ciudad"
                label="Ciudad"
                placeholder="Selecciona una ciudad"
                options={toOptions(ciudades)}
                required
                onValueChange={() => setValue("municipio", "")}
              />
            ) : (
              <FormText control={control} name="ciudad" label="Ciudad" placeholder="Escribe la ciudad" required />
            )}
            {municipios.length > 0 ? (
              <FormSelect
                control={control}
                name="municipio"
                label="Municipio"
                placeholder="Selecciona un municipio"
                options={toOptions(withCurrent(municipios, municipio))}
                required
              />
            ) : (
              <FormText control={control} name="municipio" label="Municipio" placeholder="Escribe el municipio" required />
            )}
            <div className="md:col-span-3">
              <FormText control={control} name="direccion" label="Dirección (opcional)" placeholder="Carrera 43A # 1-50, barrio El Poblado" />
            </div>
          </div>
        </Section>

        <Section id="precio" title="Precio y características" description="Valores en pesos colombianos (COP) y medidas del inmueble.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormNumber control={control} name="precioBase" label="Precio base (COP)" placeholder="$ 500.000.000" currency required />
            <FormNumber control={control} name="precioComercial" label="Precio comercial (COP, opcional)" placeholder="$ 750.000.000" currency />
            <FormNumber control={control} name="area" label="Área (m²)" placeholder="120" required />
            <FormNumber control={control} name="habitaciones" label="Habitaciones (opcional)" placeholder="3" maxValue={100} />
            <FormNumber control={control} name="banos" label="Baños (opcional)" placeholder="2" maxValue={100} />
          </div>
        </Section>

        <Section id="imagenes" title="Imágenes" description="La primera imagen es la principal. Arrastra para reordenar.">
          <Controller
            control={control}
            name="imagenes"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <ImageUploader
                  initialImages={
                    remate ? remate.imagenes.map((ref, index) => ({ ref, url: remate.imagenUrls[index] })) : []
                  }
                  onChange={field.onChange}
                  onBusyChange={setIsUploading}
                  isInvalid={fieldState.invalid}
                />
                {fieldState.error ? (
                  <p role="alert" className="text-xs text-danger">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
        </Section>
      </Accordion>

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t border-border bg-background/90 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8">
        {isUploading ? <p className="mr-auto text-xs text-muted">Subiendo imágenes…</p> : null}
        <Link
          href="/admin/remates"
          className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-surface-secondary"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          isPending={formState.isSubmitting}
          isDisabled={isUploading}
          className="h-10 rounded-full px-6 font-medium"
        >
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : null}
              {isEdit ? "Guardar cambios" : "Crear remate"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
