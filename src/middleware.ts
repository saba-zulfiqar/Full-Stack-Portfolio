import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin",
    "/admin/projects/:path*",
    "/admin/skills/:path*",
    "/admin/timeline/:path*",
    "/admin/settings/:path*",
    "/admin/messages/:path*",
    "/api/admin/:path*",
  ],
};
