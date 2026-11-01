import { Chip } from "@heroui/react";
import { Gavel, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIPO_REMATE_LABELS, type TipoRemateKey } from "@/lib/remate-labels";

const TIPO_REMATE_STYLE = {
  rama_judicial: { color: "accent", Icon: Gavel },
  dian: { color: "warning", Icon: Landmark },
} as const satisfies Record<TipoRemateKey, { color: "accent" | "warning"; Icon: typeof Gavel }>;

/** Etiqueta que distingue los remates de la Rama Judicial de los de la DIAN. */
export function TipoRemateChip({
  tipo,
  size = "sm",
  className,
}: {
  tipo: TipoRemateKey;
  size?: "sm" | "md";
  className?: string;
}) {
  const { color, Icon } = TIPO_REMATE_STYLE[tipo];

  return (
    <Chip color={color} variant="soft" size={size} className={cn("rounded-full", className)}>
      <Icon className="size-3" aria-hidden />
      {TIPO_REMATE_LABELS[tipo]}
    </Chip>
  );
}
