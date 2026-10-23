import type { Metadata } from "next";
import { Logo } from "@/components/branding/logo";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Ingresar",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const { next } = await searchParams;

  return (
    <main className="grid min-h-dvh bg-white text-[#030712] lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-[#030712] p-12 text-white lg:flex">
        <Logo tone="light" />
        <div className="max-w-md">
          <p className="text-3xl font-medium tracking-tight">
            Gestiona los remates de vivienda de toda Colombia desde un solo
            lugar.
          </p>
          <p className="mt-4 text-sm text-zinc-400">
            Publica, edita y destaca oportunidades inmobiliarias con total
            control.
          </p>
        </div>
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Remates Vargas
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />
          <h1 className="text-2xl font-medium tracking-tight">
            Panel administrativo
          </h1>
          <p className="mt-2 mb-8 text-sm text-zinc-600">
            Ingresa con tu cuenta para continuar.
          </p>
          <LoginForm next={typeof next === "string" ? next : undefined} />
        </div>
      </section>
    </main>
  );
}
