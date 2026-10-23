import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * `light` = marca blanca para fondos oscuros; `dark` = marca negra para fondos claros;
   * `auto` = se adapta al tema (clase `.dark`).
   */
  tone?: "light" | "dark" | "auto";
  className?: string;
}

export function Logo({ tone = "dark", className }: LogoProps) {
  const onDark = tone === "light";
  const auto = tone === "auto";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold tracking-tight",
          auto
            ? "bg-[#030712] text-white dark:bg-white dark:text-[#030712]"
            : onDark
              ? "bg-white text-[#030712]"
              : "bg-[#030712] text-white",
        )}
      >
        RV
      </span>
      <span
        className={cn(
          "text-lg font-medium tracking-tight whitespace-nowrap",
          auto
            ? "text-[#030712] dark:text-white"
            : onDark
              ? "text-white"
              : "text-[#030712]",
        )}
      >
        Remates Vargas
      </span>
    </div>
  );
}
