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
