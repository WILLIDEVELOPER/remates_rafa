import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} | Remates de vivienda en Colombia`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen por defecto al compartir el sitio; los remates usan su propia foto principal.
export default async function OpengraphImage() {
  // Se genera en el build (ruta estática), así que `public/` está disponible en disco.
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#030712",
          color: "#ffffff",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse no usa next/image */}
          <img src={logoSrc} alt="" height={96} width={116} />
          <div style={{ fontSize: 38, fontWeight: 600 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>
            Oportunidades inmobiliarias en remate
          </div>
          <div style={{ fontSize: 34, color: "#a1a1aa" }}>
            Casas, apartamentos, lotes y locales en toda Colombia
          </div>
        </div>
      </div>
    ),
    size,
  );
}
