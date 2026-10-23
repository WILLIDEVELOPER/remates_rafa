import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Coverage,
  CtaSection,
  FeaturedRemates,
  FeaturedRematesSkeleton,
  Hero33,
  ValuePropsSection,
} from "@/features/landing";
import { DEPARTAMENTOS } from "@/features/remates";
import { getCoverageAction } from "@/server/presentation/actions/remate-actions";

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
      <Hero33 />
      <Suspense fallback={<FeaturedRematesSkeleton />}>
        <FeaturedRemates />
      </Suspense>
      <ValuePropsSection />
      <Suspense fallback={null}>
        <CoverageSection />
      </Suspense>
      <CtaSection />
    </>
  );
}
