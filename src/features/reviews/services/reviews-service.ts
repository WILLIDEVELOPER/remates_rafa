import { createResenaAction } from "@/server/presentation/actions/resena-actions";
import type { ReviewFormValues } from "../schemas/review-schema";

export function sendReview(values: ReviewFormValues, remateId: string) {
  return createResenaAction({ ...values, remateId });
}
