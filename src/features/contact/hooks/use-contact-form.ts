"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@heroui/react";
import { useForm } from "react-hook-form";
import {
  contactFormSchema,
  type ContactFormValues,
} from "../schemas/contact-schema";
import { sendContactRequest } from "../services/contact-service";

interface UseContactFormOptions {
  remateId?: string;
  defaultMessage?: string;
  onSuccess?: () => void;
}

const FIELDS = ["nombre", "email", "telefono", "mensaje"] as const;

export function useContactForm({
  remateId,
  defaultMessage = "",
  onSuccess,
}: UseContactFormOptions = {}) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      mensaje: defaultMessage,
      website: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await sendContactRequest(values, remateId);

    if (result.ok) {
      toast.success("Mensaje enviado", {
        description: "Un asesor se pondrá en contacto contigo muy pronto.",
      });
      form.reset({ nombre: "", email: "", telefono: "", mensaje: defaultMessage, website: "" });
      onSuccess?.();
      return;
    }

    for (const field of FIELDS) {
      const message = result.error.fieldErrors?.[field]?.[0];
      if (message) form.setError(field, { message });
    }
    toast.danger("No pudimos enviar tu mensaje", {
      description: result.error.message,
    });
  });

  return { form, onSubmit };
}
