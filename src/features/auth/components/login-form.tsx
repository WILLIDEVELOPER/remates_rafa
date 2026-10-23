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
import { Controller } from "react-hook-form";
import { useLoginForm } from "../hooks/use-login-form";

interface LoginFormProps {
  next?: string;
}

export function LoginForm({ next }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { form, formError, onSubmit } = useLoginForm(next);
  const { control, formState } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {formError ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>No pudimos iniciar sesión</Alert.Title>
            <Alert.Description>{formError}</Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            name={field.name}
            type="email"
            autoComplete="email"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={fieldState.invalid}
            validationBehavior="aria"
            isRequired
            className="w-full"
          >
            <Label>Correo electrónico</Label>
            <Input placeholder="admin@remates.co" />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField
            name={field.name}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={fieldState.invalid}
            validationBehavior="aria"
            isRequired
            className="w-full"
          >
            <Label>Contraseña</Label>
            <div className="relative">
              <Input placeholder="••••••••" className="w-full pr-11" />
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                onPress={() => setShowPassword((visible) => !visible)}
                className="absolute top-1/2 right-1.5 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      <Button
        type="submit"
        fullWidth
        isPending={formState.isSubmitting}
        className="rounded-full"
      >
        {({ isPending }) => (
          <>
            {isPending ? <Spinner color="current" size="sm" /> : null}
            Ingresar
          </>
        )}
      </Button>
    </form>
  );
}
