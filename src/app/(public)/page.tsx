import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Coverage,
  CtaSection,
  FeaturedRemates,
  FeaturedRematesSkeleton,
  Hero33,
  ValuePropsSection,
} from "@/features/landing";
import { DEPARTAMENTOS } from "@/features/remates";
import { SeoAbout } from "@/features/seo";
import { getBaseUrl, SITE } from "@/lib/site";
import { getCoverageAction } from "@/server/presentation/actions/remate-actions";

/** Negocio local (Bucaramanga) y sitio web, para que los buscadores los asocien a la zona. */
function buildStructuredData() {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const organizationId = `${baseUrl}/#organizacion`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["RealEstateAgent", "LocalBusiness"],
        "@id": organizationId,
        name: SITE.name,
        url: baseUrl,
        description: SITE.description,
        image: `${baseUrl}/logo.png`,
        telephone: `+${SITE.whatsappContacts[0].number}`,
        email: SITE.emails[0],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bucaramanga",
          addressRegion: "Santander",
          addressCountry: "CO",
        },
        areaServed: [
          { "@type": "City", name: "Bucaramanga" },
          { "@type": "City", name: "Floridablanca" },
          { "@type": "City", name: "Girón" },
          { "@type": "City", name: "Piedecuesta" },
          { "@type": "AdministrativeArea", name: "Santander" },
          { "@type": "Country", name: "Colombia" },
        ],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: SITE.openingHours.days,
          opens: SITE.openingHours.opens,
          closes: SITE.openingHours.closes,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#sitio`,
        url: baseUrl,
        name: SITE.name,
        inLanguage: "es-CO",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

async function CoverageSection() {
  const result = await getCoverageAction();

  return (
    <Coverage
      departamentos={DEPARTAMENTOS}
      counts={result.ok ? result.data : []}
    />
  );
}

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Se regenera cada 5 min y al instante cuando el admin modifica remates (revalidatePath).
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildStructuredData()} />
      <Hero33 />
      <Suspense fallback={<FeaturedRematesSkeleton />}>
        <FeaturedRemates />
      </Suspense>
      <ValuePropsSection />
      <SeoAbout />
      <Suspense fallback={null}>
        <CoverageSection />
      </Suspense>
      <CtaSection />
    </>
  );
}
