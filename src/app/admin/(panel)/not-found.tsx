import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/link-button";

export default function AdminNotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl py-16">
      <EmptyState
        headingLevel="h1"
        icon={SearchX}
        title="No encontramos lo que buscas"
        description="El elemento no existe o fue eliminado."
        action={
          <LinkButton href="/admin/remates" className="h-10 px-5 font-medium">
            Volver a remates
          </LinkButton>
        }
      />
    </div>
  );
}
