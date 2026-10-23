import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/link-button";

export default function RemateNotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-24">
      <EmptyState
        headingLevel="h1"
        icon={SearchX}
        title="Este remate no está disponible"
        description="Es posible que haya sido retirado o que el enlace sea incorrecto."
        action={
          <LinkButton href="/remates" className="h-10 px-5 font-medium">
            Ver remates disponibles
          </LinkButton>
        }
      />
    </div>
  );
}
