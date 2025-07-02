import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token");

  const protectedPaths = [
    "/dashboard",
    "/add-stops",
    "/update-stops",
    "/add-routes",
    "/update-routes",
    "/routestops",
  ];

  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/add-stops",
    "/update-stops",
    "/add-routes",
    "/update-routes",
    "/routestops",
  ],
};
