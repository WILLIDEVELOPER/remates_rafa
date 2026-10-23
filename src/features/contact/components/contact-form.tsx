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
import { Controller, type Control } from "react-hook-form";
import { useContactForm } from "../hooks/use-contact-form";
import type { ContactFormValues } from "../schemas/contact-schema";

interface ContactFormProps {
  remateId?: string;
  defaultMessage?: string;
  onSuccess?: () => void;
}

function Field({
  control,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  required,
}: {
  control: Control<ContactFormValues>;
  name: "nombre" | "email" | "telefono";
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
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
          isRequired={required}
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

export function ContactForm({ remateId, defaultMessage, onSuccess }: ContactFormProps) {
  const { form, onSubmit } = useContactForm({ remateId, defaultMessage, onSuccess });
  const { control, register, formState } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field control={control} name="nombre" label="Nombre completo" autoComplete="name" placeholder="Tu nombre" required />
        <Field control={control} name="email" label="Correo electrónico" type="email" autoComplete="email" placeholder="tu@correo.com" required />
      </div>
      <Field control={control} name="telefono" label="Teléfono (opcional)" type="tel" autoComplete="tel" placeholder="+57 300 000 0000" />

      <Controller
        control={control}
        name="mensaje"
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
            <Label>Mensaje</Label>
            <TextArea rows={5} placeholder="¿En qué podemos ayudarte?" className="w-full" />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {/* Campo trampa anti-spam: oculto para personas, los bots suelen llenarlo. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No llenar este campo
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <Button type="submit" isPending={formState.isSubmitting} className="h-11 rounded-full">
        {({ isPending }) => (
          <>
            {isPending ? <Spinner color="current" size="sm" /> : null}
            Enviar mensaje
          </>
        )}
      </Button>
    </form>
  );
}
