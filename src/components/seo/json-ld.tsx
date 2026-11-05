import { getBaseUrl } from "@/lib/site";

/** Datos estructurados. Se escapa "<" para que ningún texto pueda cerrar la etiqueta <script>. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Migas de pan; `path` es relativo al sitio ("/remates"). */
export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]) {
  const baseUrl = getBaseUrl().replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}
