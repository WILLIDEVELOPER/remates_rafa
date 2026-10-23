import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell, AdminThemeProvider } from "@/features/admin";
import { getUnreadContactCountAction } from "@/server/presentation/actions/contact-actions";
import { getAdminSession } from "@/server/presentation/auth/require-admin";

// Depende de la sesión (cookies) en cada request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel" },
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: LayoutProps<"/admin">) {
  // El proxy ya filtra; esta es la verificación real (rol incluido).
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const unread = await getUnreadContactCountAction();

  return (
    <AdminThemeProvider>
      <AdminShell
        user={{ name: session.name, email: session.email, role: session.role }}
        unread={unread.ok ? unread.data : 0}
      >
        {children}
      </AdminShell>
    </AdminThemeProvider>
  );
}
