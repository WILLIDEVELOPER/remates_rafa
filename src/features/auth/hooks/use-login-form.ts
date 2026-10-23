"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginFormSchema, type LoginFormValues } from "../schemas/login-schema";
import { login } from "../services/auth-service";

export function useLoginForm(next?: string) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result = await login(values, next);

    if (result.ok) {
      router.replace(result.data.redirectTo);
      router.refresh();
      return;
    }

    for (const [field, messages] of Object.entries(
      result.error.fieldErrors ?? {},
    )) {
      if (field === "email" || field === "password") {
        form.setError(field, { message: messages[0] });
      }
    }
    setFormError(result.error.message);
  });

  return { form, formError, onSubmit };
}
