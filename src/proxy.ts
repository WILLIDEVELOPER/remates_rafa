import { NextResponse, type NextRequest } from "next/server";
import { isAdminRole } from "@/server/domain/entities/user";
import { auth } from "@/server/infrastructure/services/auth";

const LOGIN_PATH = "/admin/login";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await auth.api.getSession({ headers: request.headers });
  const isAdmin = Boolean(session) && isAdminRole(session?.user.role);

  if (pathname === LOGIN_PATH) {
    return isAdmin
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();
  }

  if (!isAdmin) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    if (request.method === "GET") {
      loginUrl.searchParams.set("next", `${pathname}${search}`);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
