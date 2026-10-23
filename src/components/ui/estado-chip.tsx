import { Chip } from "@heroui/react";
import { cn } from "@/lib/utils";
import { ESTADO_LABELS, type EstadoRemateKey } from "@/lib/remate-labels";

const ESTADO_COLOR = {
  disponible: "success",
  en_remate: "warning",
  adjudicado: "default",
  suspendido: "danger",
} as const satisfies Record<EstadoRemateKey, "success" | "warning" | "default" | "danger">;

export function EstadoChip({
  estado,
  size = "sm",
  className,
}: {
  estado: EstadoRemateKey;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <Chip
      color={ESTADO_COLOR[estado]}
      variant="soft"
      size={size}
      className={cn("rounded-full", className)}
    >
      {ESTADO_LABELS[estado]}
    </Chip>
  );
}
