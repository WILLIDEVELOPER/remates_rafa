"use client";

import "./globals.css";

// Último recurso: falla el propio layout raíz, así que se define su propio <html>.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es-CO">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-4 text-center text-[#030712]">
        <h1 className="text-2xl font-medium tracking-tight">Algo salió mal</h1>
        <p className="max-w-md text-sm text-zinc-600">
          Ocurrió un error inesperado. Inténtalo de nuevo en unos instantes.
        </p>
        <button
          type="button"
          onClick={reset}
          className="h-10 rounded-full bg-[#030712] px-5 text-sm font-medium text-white"
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
