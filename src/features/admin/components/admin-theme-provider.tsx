"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, type ReactNode } from "react";

/** El tema solo existe dentro del panel: el sitio público siempre es claro. */
export function AdminThemeProvider({ children }: { children: ReactNode }) {
  // Al salir del panel (navegación en cliente) se quita el tema para que el sitio público siga claro.
  useEffect(() => {
    return () => {
      const root = document.documentElement;
      root.classList.remove("dark", "light");
      root.style.removeProperty("color-scheme");
    };
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="admin-theme"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
