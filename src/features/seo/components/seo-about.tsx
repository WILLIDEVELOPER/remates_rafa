import { LinkButton } from "@/components/ui/link-button";
import { GUIA_PATH } from "@/lib/seo-zones";
import { ZoneLinks } from "./zone-links";

/** Texto de la home orientado a las búsquedas locales (Bucaramanga y Santander). */
export function SeoAbout() {
  return (
    <section aria-labelledby="remates-bucaramanga" className="py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8 xl:px-16">
        <div className="flex flex-col gap-4">
          <h2
            id="remates-bucaramanga"
            className="text-3xl font-medium tracking-tight sm:text-4xl"
          >
            Remates judiciales en Bucaramanga y Santander
          </h2>
          <p className="text-muted">
            Reunimos inmuebles en remate judicial en Bucaramanga, Floridablanca, Girón,
            Piedecuesta y el resto de Santander: casas, apartamentos, lotes, locales y fincas con
            un precio base inferior al avalúo comercial.
          </p>
          <p className="text-muted">
            Te asesoramos para participar en cada remate, desde revisar la situación jurídica del
            inmueble hasta la adjudicación y el traspaso. También publicamos remates de la DIAN y
            ofrecemos la gestión del RUT para postores.
          </p>
          <div className="pt-2">
            <LinkButton href={GUIA_PATH} variant="outline" withArrow className="h-10 px-5 font-medium">
              Cómo participar en un remate judicial
            </LinkButton>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium tracking-tight">Encuentra remates por zona</h3>
          <ZoneLinks />
        </div>
      </div>
    </section>
  );
}
