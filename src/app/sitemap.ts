import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";
import { getSitemapEntriesAction } from "@/server/presentation/actions/remate-actions";

// Se regenera cada hora; los remates nuevos aparecen sin necesidad de un nuevo despliegue.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const entries = await getSitemapEntriesAction();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/remates`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/contacto`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/legal/terminos`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/legal/privacidad`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const remates: MetadataRoute.Sitemap = entries.ok
    ? entries.data.map((entry) => ({
        url: `${baseUrl}/remates/${entry.slug}`,
        lastModified: new Date(entry.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      }))
    : [];

  return [...staticPages, ...remates];
}
