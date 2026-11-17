import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const isPublicAdminPath =
    pathname.startsWith("/admin/login") || pathname.startsWith("/admin/setup");

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (isPublicAdminPath) {
    if (session && pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
