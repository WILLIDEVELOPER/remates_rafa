import { buttonVariants } from "@heroui/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonStyle = NonNullable<Parameters<typeof buttonVariants>[0]>;

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: ButtonStyle["variant"];
  size?: ButtonStyle["size"];
  fullWidth?: boolean;
  /** Muestra una flecha `ArrowUpRight` con micro-desplazamiento al hacer hover. */
  withArrow?: boolean;
}

/** Enlace de Next.js con el aspecto de un `Button` de HeroUI. */
export function LinkButton({
  variant,
  size,
  fullWidth,
  withArrow,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ variant, size, fullWidth }),
        "group rounded-full",
        className,
      )}
    >
      {children}
      {withArrow ? (
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      ) : null}
    </Link>
  );
}
