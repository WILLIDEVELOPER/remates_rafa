"use client";

import { ErrorView } from "@/components/ui/error-view";

export default function AdminPanelError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView {...props} homeHref="/admin" homeLabel="Volver al dashboard" />;
}
