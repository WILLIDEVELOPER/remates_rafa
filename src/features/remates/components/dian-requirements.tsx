import { BadgeCheck, CircleCheck, FileCheck2, PenLine, Wallet } from "lucide-react";
import type { ReactNode } from "react";

const REQUIREMENTS = [
  {
    icon: Wallet,
    title: "Presupuesto disponible",
    description:
      "Debes contar con los recursos para participar y, si resultas adjudicatario, para completar el pago del inmueble.",
  },
  {
    icon: FileCheck2,
    title: "RUT actualizado como postor",
    description:
      "Tu RUT debe estar vigente y actualizado en calidad de postor antes de la fecha del remate.",
  },
  {
    icon: PenLine,
    title: "Firma electrónica actualizada",
    description:
      "Debes tener tu firma electrónica vigente y actualizada para poder participar en el remate.",
  },
] as const;

/**
 * Requisitos de los remates de la DIAN y oferta del servicio de gestión del RUT.
 *
 * Es contenido público a propósito: aquí solo se dice QUE el servicio existe. El detalle del
 * trámite (casilla, código, pasos) no vive en el código, en la base de datos ni en el HTML:
 * se entrega por contacto directo a quien contrata el servicio.
 */
export function DianRequirements({ action }: { action: ReactNode }) {
  return (
    <section
      aria-labelledby="requisitos-dian"
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface-secondary/50 p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="requisitos-dian" className="text-xl font-medium tracking-tight">
          Requisitos para participar (remate DIAN)
        </h2>
        <p className="text-sm text-muted">
          Los remates de la DIAN exigen cumplir estos requisitos como postor.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {REQUIREMENTS.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="flex gap-3 rounded-xl border border-border bg-background p-4 sm:last:odd:col-span-2"
          >
            <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="text-xs leading-relaxed text-muted">{description}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <BadgeCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium">¿Necesitas ayuda con el RUT?</h3>
            <p className="text-xs leading-relaxed text-muted">
              Ofrecemos el servicio de gestión y actualización del RUT como postor. Al contratarlo
              te entregamos el paso a paso exacto del trámite.
            </p>
          </div>
        </div>
        <div className="shrink-0">{action}</div>
      </div>

      <p className="flex items-start gap-2 text-sm">
        <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          <strong className="font-medium">El servicio incluye la actualización del RUT</strong> como
          postor: no tienes que hacer ese trámite por tu cuenta.
        </span>
      </p>
    </section>
  );
}
