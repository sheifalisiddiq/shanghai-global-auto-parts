import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
} from "@/lib/admin/auth/constants";
import { canAccessPath } from "@/lib/admin/access/access";
import { isRoleId } from "@/lib/admin/access/roles";

const DENIED_PATH = "/admin/access-denied";

// Runs ONLY for /admin routes (see matcher): public pages never touch this.
// Demo gate: the marker cookie carries the role id. Route permission is checked
// against the built-in role defaults (the same function the client uses).
// Replace the cookie check with real session validation when real auth arrives.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
  const roleId = isRoleId(cookie) ? cookie : null;
  const isLogin = pathname === ADMIN_LOGIN_PATH;

  let response: NextResponse;
  if (!roleId) {
    if (isLogin) {
      response = NextResponse.next();
    } else {
      response = NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
      // A cookie with an unknown role value is stale: clear it.
      if (cookie) response.cookies.delete(ADMIN_COOKIE);
    }
  } else if (isLogin) {
    response = NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url));
  } else if (!canAccessPath(roleId, pathname, true)) {
    response = NextResponse.rewrite(new URL(DENIED_PATH, request.url), { status: 403 });
  } else {
    response = NextResponse.next();
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
