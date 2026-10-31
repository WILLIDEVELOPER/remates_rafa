"use client";

import {
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  TextArea,
  TextField,
} from "@heroui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Controller, useWatch, type Control } from "react-hook-form";
import { useReviewForm } from "../hooks/use-review-form";
import { REVIEW_MAX, type ReviewFormValues } from "../schemas/review-schema";

interface ReviewFormProps {
  remateId: string;
  onSuccess?: () => void;
}

function Field({
  control,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
}: {
  control: Control<ReviewFormValues>;
  name: "nombre" | "email" | "telefono";
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          name={field.name}
          type={type}
          autoComplete={autoComplete}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={fieldState.invalid}
          isRequired
          validationBehavior="aria"
          className="w-full"
        >
          <Label>{label}</Label>
          <Input placeholder={placeholder} className="w-full" />
          <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
      )}
    />
  );
}

export function ReviewForm({ remateId, onSuccess }: ReviewFormProps) {
  const { form, step, goToReview, goBack, onSubmit } = useReviewForm({ remateId, onSuccess });
  const { control, register, formState } = form;
  const comentario = useWatch({ control, name: "comentario" });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        Paso {step} de 2 · {step === 1 ? "Tus datos" : "Tu reseña"}
      </p>

      {/* Ambos pasos permanecen montados; el oculto no se ve ni se enfoca. */}
      <div hidden={step !== 1} className="flex flex-col gap-4">
        <Field control={control} name="nombre" label="Nombre completo" autoComplete="name" placeholder="Tu nombre" />
        <Field control={control} name="email" label="Correo electrónico" type="email" autoComplete="email" placeholder="tu@correo.com" />
        <Field control={control} name="telefono" label="Número de teléfono" type="tel" autoComplete="tel" placeholder="+57 311 482 6905" />
        <p className="text-xs text-muted">
          Tu correo y tu teléfono no se publican: en la reseña solo se muestran tu nombre y tu comentario.
        </p>
        <Button type="button" onPress={goToReview} className="h-11 rounded-full">
          Continuar
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div hidden={step !== 2} className="flex flex-col gap-4">
        <Controller
          control={control}
          name="comentario"
          render={({ field, fieldState }) => (
            <TextField
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              isRequired
              validationBehavior="aria"
              className="w-full"
            >
              <Label>Tu reseña</Label>
              <TextArea rows={6} placeholder="Cuéntanos tu experiencia con este remate" className="w-full" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <div className="-mt-2 flex items-start justify-between gap-4 text-xs text-muted">
          <p>Sin enlaces, datos de contacto, emojis ni lenguaje ofensivo.</p>
          <p className="shrink-0">
            {comentario.length} / {REVIEW_MAX}
          </p>
        </div>

        {/* Campo trampa anti-spam: oculto para personas, los bots suelen llenarlo. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            No llenar este campo
            <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onPress={goBack} className="h-11 rounded-full">
            <ArrowLeft className="size-4" />
            Atrás
          </Button>
          <Button type="submit" isPending={formState.isSubmitting} className="h-11 flex-1 rounded-full">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : null}
                Publicar reseña
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
