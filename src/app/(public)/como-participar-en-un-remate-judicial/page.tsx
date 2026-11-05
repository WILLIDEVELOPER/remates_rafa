import type { Metadata } from "next";
import { breadcrumbJsonLd, JsonLd } from "@/components/seo/json-ld";
import { LinkButton } from "@/components/ui/link-button";
import { RemateFaq, ZoneLinks } from "@/features/seo";
import { GUIA_PATH } from "@/lib/seo-zones";

export const metadata: Metadata = {
  title: "Cómo participar en un remate judicial de inmuebles",
  description:
    "Guía para comprar un inmueble en remate judicial: precio base, valor para participar, requisitos, adjudicación y asesoría en Bucaramanga y Santander.",
  alternates: { canonical: GUIA_PATH },
  openGraph: {
    title: "Cómo participar en un remate judicial de inmuebles",
    description:
      "Precio base, valor para participar, requisitos y adjudicación: la guía para comprar un inmueble en remate judicial.",
    type: "article",
    url: GUIA_PATH,
  },
};

const STEPS = [
  {
    title: "Elige el inmueble y revisa su situación jurídica",
    description:
      "Mira el avalúo, la ubicación, el estado del proceso y la fecha del remate. Antes de decidir, conviene revisar con un asesor que el inmueble no tenga limitaciones que afecten tu compra.",
  },
  {
    title: "Define tu presupuesto",
    description:
      "La postura parte del precio base, que corresponde al 70 % del avalúo. Para tener derecho a participar se consigna el 40 % del avalúo. Cada remate publicado muestra ambos valores.",
  },
  {
    title: "Prepara tus documentos",
    description:
      "El despacho indica en el aviso de remate qué documentos y qué forma de participación exige. En los remates de la DIAN, además, necesitas el RUT actualizado en calidad de postor y la firma electrónica vigente.",
  },
  {
    title: "Presenta tu postura en la fecha del remate",
    description:
      "La postura se presenta en la fecha y de la forma que señale el aviso de remate. Quien ofrece la mejor postura queda como candidato a la adjudicación.",
  },
  {
    title: "Adjudicación, pago y traspaso",
    description:
      "Si tu postura es la mejor, el juez adjudica el inmueble. Después completas el pago dentro de los plazos que fije el despacho y se hace el traspaso y el registro del inmueble a tu nombre.",
  },
] as const;

export default function GuiaPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-12 lg:py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Cómo participar en un remate judicial", path: GUIA_PATH },
        ])}
      />

      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Cómo participar en un remate judicial de inmuebles
        </h1>
        <p className="text-muted">
          Comprar un inmueble en remate judicial puede ser una buena oportunidad porque la postura
          parte por debajo del avalúo comercial. Estos son los pasos, desde la elección del inmueble
          hasta la adjudicación.
        </p>
      </header>

      <section aria-labelledby="pasos" className="flex flex-col gap-5">
        <h2 id="pasos" className="text-2xl font-medium tracking-tight">
          Pasos para comprar un inmueble en remate judicial
        </h2>
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-border p-5">
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
              >
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-medium">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="dian" className="flex flex-col gap-3">
        <h2 id="dian" className="text-2xl font-medium tracking-tight">
          Remates de la DIAN: requisitos adicionales
        </h2>
        <p className="text-muted">
          Para participar en un remate de la DIAN necesitas presupuesto disponible, el RUT
          actualizado en calidad de postor y la firma electrónica vigente. Si no tienes el RUT al
          día, ofrecemos el servicio de gestión y actualización del RUT como postor, que se
          solicita desde la página de cada remate de la DIAN.
        </p>
      </section>

      <section aria-labelledby="adjudicacion" className="flex flex-col gap-3">
        <h2 id="adjudicacion" className="text-2xl font-medium tracking-tight">
          Adjudicación de inmuebles en Bucaramanga y Santander
        </h2>
        <p className="text-muted">
          Te acompañamos en la adjudicación de inmuebles en Bucaramanga, Floridablanca, Girón,
          Piedecuesta y el resto del país: revisamos contigo el remate antes de participar y te
          orientamos en el pago y el traspaso si resultas adjudicatario.
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <LinkButton href="/contacto" withArrow className="h-10 px-5 font-medium">
            Pedir asesoría en remates judiciales
          </LinkButton>
          <LinkButton href="/remates" variant="outline" withArrow className="h-10 px-5 font-medium">
            Ver remates disponibles
          </LinkButton>
        </div>
      </section>

      <RemateFaq />

      <section aria-labelledby="zonas" className="flex flex-col gap-4">
        <h2 id="zonas" className="text-xl font-medium tracking-tight">
          Remates judiciales por zona
        </h2>
        <ZoneLinks />
      </section>
    </div>
  );
}
