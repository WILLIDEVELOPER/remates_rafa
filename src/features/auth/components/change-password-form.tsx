"use client";

import {
  Alert,
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { MIN_NEW_PASSWORD_LENGTH } from "@/server/presentation/validators/auth-schema";
import { useChangePasswordForm } from "../hooks/use-change-password-form";
import type { ChangePasswordFormValues } from "../schemas/change-password-schema";

interface PasswordFieldProps {
  control: Control<ChangePasswordFormValues>;
  name: keyof ChangePasswordFormValues;
  label: string;
  autoComplete: "current-password" | "new-password";
  description?: string;
}

function PasswordField({ control, name, label, autoComplete, description }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          name={field.name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={fieldState.invalid}
          validationBehavior="aria"
          isRequired
          className="w-full"
        >
          <Label>{label}</Label>
          <div className="relative">
            <Input placeholder="••••••••" className="w-full pr-11" />
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
              onPress={() => setVisible((value) => !value)}
              className="absolute top-1/2 right-1.5 -translate-y-1/2"
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
          {description && !fieldState.error ? (
            <p className="text-xs text-muted">{description}</p>
          ) : null}
          <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
      )}
    />
  );
}

export function ChangePasswordForm() {
  const { form, formError, success, onSubmit } = useChangePasswordForm();
  const { control, formState } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {success ? (
        <Alert status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Contraseña actualizada</Alert.Title>
            <Alert.Description>
              Usa la nueva contraseña la próxima vez que inicies sesión. Cerramos tus otras
              sesiones abiertas.
            </Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      {formError ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>No pudimos cambiar la contraseña</Alert.Title>
            <Alert.Description>{formError}</Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      <PasswordField
        control={control}
        name="currentPassword"
        label="Contraseña actual"
        autoComplete="current-password"
      />
      <PasswordField
        control={control}
        name="newPassword"
        label="Nueva contraseña"
        autoComplete="new-password"
        description={`Mínimo ${MIN_NEW_PASSWORD_LENGTH} caracteres.`}
      />
      <PasswordField
        control={control}
        name="confirmPassword"
        label="Repite la nueva contraseña"
        autoComplete="new-password"
      />

      <Button type="submit" isPending={formState.isSubmitting} className="self-start rounded-full">
        {({ isPending }) => (
          <>
            {isPending ? <Spinner color="current" size="sm" /> : null}
            Cambiar contraseña
          </>
        )}
      </Button>
    </form>
  );
}
