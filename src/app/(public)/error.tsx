"use client";

import { ErrorView } from "@/components/ui/error-view";

export default function PublicError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView {...props} homeHref="/" homeLabel="Ir al inicio" />;
}
