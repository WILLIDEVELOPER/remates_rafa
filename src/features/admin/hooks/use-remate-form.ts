"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { RemateDto } from "@/server/application/dtos/remate-dto";
import { remateFormSchema, type RemateFormValues } from "../schemas/remate-form-schema";
import { createRemateAction, updateRemateAction } from "../services/admin-service";
import { bogotaLocalToIso, isoToBogotaLocal } from "../utils/datetime";

export const FORM_SECTIONS = ["general", "ubicacion", "precio", "imagenes"] as const;

const EMPTY_VALUES: Partial<RemateFormValues> = {
  nombre: "",
  slug: "",
  descripcion: "",
  tipoInmueble: "casa",
  estado: "disponible",
  destacado: false,
  fechaRemate: "",
  departamento: "",
  ciudad: "",
  municipio: "",
  direccion: "",
  imagenes: [],
};

function toFormValues(remate: RemateDto): Partial<RemateFormValues> {
  return {
    nombre: remate.nombre,
    slug: remate.slug,
    descripcion: remate.descripcion,
    tipoInmueble: remate.tipoInmueble,
    estado: remate.estado,
    destacado: remate.destacado,
    fechaRemate: isoToBogotaLocal(remate.fechaRemate),
    departamento: remate.departamento,
    ciudad: remate.ciudad,
    municipio: remate.municipio,
    direccion: remate.direccion ?? "",
    precioBase: remate.precioBase,
    precioComercial: remate.precioComercial ?? undefined,
    area: remate.area,
    habitaciones: remate.habitaciones ?? undefined,
    banos: remate.banos ?? undefined,
    imagenes: remate.imagenes,
  };
}

function toPayload(values: RemateFormValues) {
  return {
    nombre: values.nombre,
    slug: values.slug || undefined,
    descripcion: values.descripcion,
    tipoInmueble: values.tipoInmueble,
    estado: values.estado,
    destacado: values.destacado,
    fechaRemate: bogotaLocalToIso(values.fechaRemate),
    departamento: values.departamento,
    ciudad: values.ciudad,
    municipio: values.municipio,
    direccion: values.direccion || null,
    precioBase: values.precioBase,
    precioComercial: values.precioComercial ?? null,
    area: values.area,
    habitaciones: values.habitaciones ?? null,
    banos: values.banos ?? null,
    imagenes: values.imagenes,
  };
}

interface UseRemateFormOptions {
  remate?: RemateDto;
}

export function useRemateForm({ remate }: UseRemateFormOptions) {
  const router = useRouter();
  const isEdit = Boolean(remate);

  const [isUploading, setIsUploading] = useState(false);
  const [expanded, setExpanded] = useState<Set<string | number>>(new Set(FORM_SECTIONS));
  // En edición el slug es estable; en creación sigue al nombre hasta que se edita a mano.
  const [slugTouched, setSlugTouched] = useState(isEdit);

  const form = useForm<RemateFormValues>({
    resolver: zodResolver(remateFormSchema),
    defaultValues: remate ? toFormValues(remate) : EMPTY_VALUES,
  });

  const onValid = async (values: RemateFormValues) => {
    if (isUploading) {
      toast.warning("Espera a que terminen de subir las imágenes");
      return;
    }

    const payload = toPayload(values);
    const result = remate
      ? await updateRemateAction({ id: remate.id, ...payload })
      : await createRemateAction(payload);

    if (result.ok) {
      toast.success(isEdit ? "Remate actualizado" : "Remate creado", {
        description: result.data.nombre,
      });
      router.push("/admin/remates");
      router.refresh();
      return;
    }

    const { code, message, fieldErrors } = result.error;
    let mapped = false;
    for (const [field, messages] of Object.entries(fieldErrors ?? {})) {
      if (field in remateFormSchema.shape) {
        form.setError(field as keyof RemateFormValues, { message: messages[0] });
        mapped = true;
      }
    }
    if (code === "CONFLICT") {
      form.setError("slug", { message });
      setSlugTouched(true);
      mapped = true;
    }
    if (mapped) setExpanded(new Set(FORM_SECTIONS));

    toast.danger(isEdit ? "No se pudo actualizar el remate" : "No se pudo crear el remate", {
      description: message,
    });
  };

  const onInvalid = () => {
    setExpanded(new Set(FORM_SECTIONS));
    toast.danger("Revisa los campos marcados", {
      description: "Hay información faltante o incorrecta en el formulario.",
    });
  };

  return {
    form,
    isEdit,
    onSubmit: form.handleSubmit(onValid, onInvalid),
    isUploading,
    setIsUploading,
    expanded,
    setExpanded,
    slugTouched,
    setSlugTouched,
  };
}
