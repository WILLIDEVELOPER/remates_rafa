import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * `light` = texto blanco para fondos oscuros; `dark` = texto negro para fondos claros;
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
      <Image
        src="/logo.png"
        alt=""
        aria-hidden
        width={388}
        height={320}
        className="h-10 w-auto shrink-0"
      />
      <span
        className={cn(
          "flex flex-col gap-1",
          auto
            ? "text-[#030712] dark:text-white"
            : onDark
              ? "text-white"
              : "text-[#030712]",
        )}
      >
        <span className="text-lg leading-none font-semibold tracking-tight whitespace-nowrap">
          Remates Vargas
        </span>
        <span className="flex items-center gap-2 text-[0.625rem] leading-none font-medium tracking-[0.3em] uppercase opacity-60">
          Consultores
          <span aria-hidden className="h-px flex-1 bg-current opacity-50" />
        </span>
      </span>
    </div>
  );
}
