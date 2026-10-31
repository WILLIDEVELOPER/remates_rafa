import { Card } from "@heroui/react";
import { Eye, Handshake, ShieldCheck, TrendingDown } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    title: "Seguridad jurídica",
    description:
      "Revisamos la situación legal de cada inmueble antes de publicarlo para que compres con respaldo.",
  },
  {
    icon: TrendingDown,
    title: "Precios bajo mercado",
    description:
      "Los remates parten de un precio base inferior al avalúo comercial, con descuentos de hasta el 30 %.",
  },
  {
    icon: Handshake,
    title: "Acompañamiento",
    description:
      "Te guiamos desde la elección del inmueble hasta la adjudicación y el traspaso.",
  },
  {
    icon: Eye,
    title: "Transparencia",
    description:
      "Toda la información visible: ubicación, áreas, precios, estado del proceso y fecha del remate.",
  },
] as const;

export function ValuePropsSection() {
  return (
    <section id="valor" className="scroll-mt-20 bg-surface-secondary py-20 lg:py-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 lg:px-8 xl:px-16">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="text-sm font-medium text-muted">¿Por qué elegirnos?</p>
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Invertir en un remate con confianza
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="gap-5 rounded-2xl border border-border p-6 shadow-none"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-foreground text-background">
                <Icon className="size-5" />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium tracking-tight">{title}</h3>
                <p className="text-sm text-muted">{description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
