import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
// import login from "./pages/login";
export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname.includes("/api/auth")) {
    return NextResponse.next();
  }
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  // if (!token && pathname !== "/login") {
  //   return NextResponse.redirect("./pages/login");
  // }
  return NextResponse.redirect(loginUrl);
}
