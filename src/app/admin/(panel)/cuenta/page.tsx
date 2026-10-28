import type { Metadata } from "next";
import { ChangePasswordForm } from "@/features/auth";
import { getAdminSession } from "@/server/presentation/auth/require-admin";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function AdminCuentaPage() {
  const session = await getAdminSession();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Mi cuenta</h1>
        <p className="text-sm text-muted">{session?.email}</p>
      </header>

      <section
        aria-labelledby="cambiar-contrasena"
        className="flex flex-col gap-5 rounded-2xl border border-border p-6"
      >
        <h2 id="cambiar-contrasena" className="text-lg font-medium tracking-tight">
          Cambiar contraseña
        </h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
