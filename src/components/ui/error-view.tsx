"use client";

import { Button } from "@heroui/react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { EmptyState } from "./empty-state";

interface ErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref: string;
  homeLabel: string;
}

/** Contenido común de los error boundaries: mensaje claro, reintento y salida segura. */
export function ErrorView({ error, reset, homeHref, homeLabel }: ErrorViewProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20">
      <EmptyState
        headingLevel="h1"
        icon={TriangleAlert}
        title="Algo salió mal"
        description={
          error.digest
            ? `Ocurrió un error inesperado. Si el problema continúa, indícanos este código: ${error.digest}.`
            : "Ocurrió un error inesperado. Inténtalo de nuevo en unos instantes."
        }
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onPress={reset} className="h-10 rounded-full px-5 font-medium">
              <RotateCcw className="size-4" />
              Reintentar
            </Button>
            <Link
              href={homeHref}
              className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-surface-secondary"
            >
              {homeLabel}
            </Link>
          </div>
        }
      />
    </div>
  );
}
