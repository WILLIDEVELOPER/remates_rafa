"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { reviewFormSchema, type ReviewFormValues } from "../schemas/review-schema";
import { sendReview } from "../services/reviews-service";

interface UseReviewFormOptions {
  remateId: string;
  onSuccess?: () => void;
}

const EMPTY: ReviewFormValues = { nombre: "", email: "", telefono: "", comentario: "", website: "" };
const CONTACT_FIELDS = ["nombre", "email", "telefono"] as const;
const FIELDS = [...CONTACT_FIELDS, "comentario"] as const;

/** Formulario en dos pasos: primero los datos de contacto, después la reseña. */
export function useReviewForm({ remateId, onSuccess }: UseReviewFormOptions) {
  const [step, setStep] = useState<1 | 2>(1);
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: EMPTY,
  });

  const goToReview = async () => {
    if (await form.trigger(CONTACT_FIELDS)) setStep(2);
  };

  const submit = form.handleSubmit(async (values) => {
    const result = await sendReview(values, remateId);

    if (result.ok) {
      toast.success("¡Gracias por tu reseña!", {
        description: "Ya aparece publicada en este remate.",
      });
      form.reset(EMPTY);
      setStep(1);
      onSuccess?.();
      return;
    }

    for (const field of FIELDS) {
      const message = result.error.fieldErrors?.[field]?.[0];
      if (message) form.setError(field, { message });
    }
    if (CONTACT_FIELDS.some((field) => result.error.fieldErrors?.[field])) setStep(1);

    toast.danger("No pudimos publicar tu reseña", { description: result.error.message });
  });

  // Enter en el paso 1 avanza al paso 2 en lugar de enviar el formulario.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step === 1) {
      event.preventDefault();
      return goToReview();
    }
    return submit(event);
  };

  return { form, step, goToReview, goBack: () => setStep(1), onSubmit };
}
