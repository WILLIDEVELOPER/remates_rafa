"use client";

import { Star } from "lucide-react";
import { useId } from "react";
import { formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5] as const;

const SIZES = { sm: "size-3.5", md: "size-4", lg: "size-6" } as const;

type StarSize = keyof typeof SIZES;

/**
 * Estrellas de solo lectura. Admite medias estrellas visuales (4,5 se ve a medias) y expone
 * el valor como texto para lectores de pantalla.
 */
export function StarRating({
  value,
  size = "md",
  className,
}: {
  value: number;
  size?: StarSize;
  className?: string;
}) {
  const iconSize = SIZES[size];

  return (
    <span
      role="img"
      aria-label={`${formatRating(value)} de 5 estrellas`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {STARS.map((star) => {
        const fill = Math.max(0, Math.min(1, value - (star - 1)));
        return (
          <span key={star} aria-hidden className={cn("relative inline-block", iconSize)}>
            <Star className={cn("absolute inset-0 text-border", iconSize)} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn("fill-amber-400 text-amber-400", iconSize)} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Promedio + conteo bajo las estrellas: "4,6 (12)". Sin reseñas calificadas muestra "Sin reseñas". */
export function RatingSummary({
  promedio,
  count,
  size = "sm",
  className,
}: {
  promedio: number | null;
  count: number;
  size?: StarSize;
  className?: string;
}) {
  if (promedio === null || count === 0) {
    return <span className={cn("text-xs text-muted", className)}>Sin reseñas aún</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      <StarRating value={promedio} size={size} />
      <span className="font-medium">{formatRating(promedio)}</span>
      <span className="text-muted">({count})</span>
    </span>
  );
}

const STAR_LABELS = ["Muy malo", "Malo", "Regular", "Bueno", "Excelente"] as const;

/**
 * Selector de calificación de 1 a 5 como grupo de radios: se maneja con teclado (flechas)
 * y los lectores de pantalla anuncian "N de 5 estrellas".
 */
export function StarRatingInput({
  value,
  onChange,
  onBlur,
  isInvalid,
  name,
}: {
  value: number | undefined;
  onChange: (value: number) => void;
  onBlur?: () => void;
  isInvalid?: boolean;
  name: string;
}) {
  const groupId = useId();

  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Calificación" aria-invalid={isInvalid} className="flex gap-1">
        {STARS.map((star) => {
          const id = `${groupId}-${star}`;
          const active = value !== undefined && star <= value;

          return (
            <span key={star} className="relative">
              <input
                id={id}
                type="radio"
                name={name}
                value={star}
                checked={value === star}
                onChange={() => onChange(star)}
                onBlur={onBlur}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                title={STAR_LABELS[star - 1]}
                className="block cursor-pointer rounded-md p-0.5 peer-focus-visible:ring-2 peer-focus-visible:ring-focus"
              >
                <span className="sr-only">
                  {star} de 5 estrellas · {STAR_LABELS[star - 1]}
                </span>
                <Star
                  aria-hidden
                  className={cn(
                    "size-8 transition-colors",
                    active ? "fill-amber-400 text-amber-400" : "text-border hover:text-amber-300",
                  )}
                />
              </label>
            </span>
          );
        })}
      </div>
      <span aria-live="polite" className="text-sm text-muted">
        {value ? STAR_LABELS[value - 1] : "Elige una calificación"}
      </span>
    </div>
  );
}
