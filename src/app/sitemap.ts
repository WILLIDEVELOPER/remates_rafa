import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";
import { GUIA_PATH, zonaPath, ZONAS } from "@/lib/seo-zones";
import {
  getSitemapEntriesAction,
  listRematesAction,
} from "@/server/presentation/actions/remate-actions";

// Se regenera cada hora; los remates nuevos aparecen sin necesidad de un nuevo despliegue.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const [entries, zonaResults] = await Promise.all([
    getSitemapEntriesAction(),
    Promise.all(ZONAS.map((zona) => listRematesAction(zona.filtros))),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/remates`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}${GUIA_PATH}`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contacto`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/legal/terminos`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/legal/privacidad`, changeFrequency: "yearly", priority: 0.1 },
  ];

  // Solo las zonas con remates publicados: las vacías van con noindex y no deben figurar aquí.
  const zonas: MetadataRoute.Sitemap = ZONAS.filter((_, index) => {
    const result = zonaResults[index];
    return result.ok && result.data.total > 0;
  }).map((zona) => ({
    url: `${baseUrl}${zonaPath(zona)}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const remates: MetadataRoute.Sitemap = entries.ok
    ? entries.data.map((entry) => ({
        url: `${baseUrl}/remates/${entry.slug}`,
        lastModified: new Date(entry.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      }))
    : [];

  return [...staticPages, ...zonas, ...remates];
}
