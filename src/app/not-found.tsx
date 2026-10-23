import type { Metadata } from "next";
import { Logo } from "@/components/branding/logo";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 text-center">
      <Logo />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted">Error 404</p>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          No encontramos esta página
        </h1>
        <p className="max-w-md text-muted">
          Es posible que el enlace sea incorrecto o que la página haya sido
          movida.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <LinkButton href="/" className="h-10 px-5 font-medium">
          Ir al inicio
        </LinkButton>
        <LinkButton href="/remates" variant="outline" className="h-10 px-5 font-medium">
          Ver remates
        </LinkButton>
      </div>
    </main>
  );
}
