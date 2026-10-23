import type { Metadata } from "next";
import { RemateForm } from "@/features/admin";

export const metadata: Metadata = { title: "Nuevo remate" };

export default function NuevoRematePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Nuevo remate</h1>
        <p className="text-sm text-muted">Completa la información y sube al menos una imagen.</p>
      </header>
      <RemateForm />
    </div>
  );
}
