import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";

const DOCUMENTS = {
  terminos: "Términos y condiciones",
  privacidad: "Política de privacidad",
} as const;

type DocumentKey = keyof typeof DOCUMENTS;

const isDocument = (value: string): value is DocumentKey => value in DOCUMENTS;

export function generateStaticParams() {
  return Object.keys(DOCUMENTS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const { doc } = await params;
  return { title: isDocument(doc) ? DOCUMENTS[doc] : "Documento legal" };
}

export default async function LegalPage({ params }: PageProps<"/legal/[doc]">) {
  const { doc } = await params;
  if (!isDocument(doc)) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 lg:py-24">
      <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">{DOCUMENTS[doc]}</h1>
      <p className="mt-6 text-muted">
        Este documento está pendiente de redacción y revisión legal por parte
        de {SITE.name}. Mientras tanto, para cualquier consulta sobre el
        tratamiento de tus datos o las condiciones del servicio puedes
        escribirnos a {SITE.email}.
      </p>
    </div>
  );
}
