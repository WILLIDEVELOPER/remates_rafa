"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  changePasswordFormSchema,
  type ChangePasswordFormValues,
} from "../schemas/change-password-schema";
import { changePassword } from "../services/auth-service";

const EMPTY_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function useChangePasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSuccess(false);

    const result = await changePassword(values);

    if (result.ok) {
      form.reset(EMPTY_VALUES);
      setSuccess(true);
      return;
    }

    for (const [field, messages] of Object.entries(result.error.fieldErrors ?? {})) {
      if (field === "currentPassword" || field === "newPassword") {
        form.setError(field, { message: messages[0] });
      }
    }
    setFormError(result.error.message);
  });

  return { form, formError, success, onSubmit };
}
