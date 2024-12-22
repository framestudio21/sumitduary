// /src/middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';

const PROTECTED_ROUTES = /^\/admin(?!\/login).*$/;
const JWT_SECRET = process.env.JWT_SECRET || "e8ad46188b56c0b64a9b58262a0e114f8f777bee4e0ff35b7b5f72dda5786f40";

export const config = {
  matcher: ["/admin/:path*"],
  // runtime: "experimental-edge", // Use Edge runtime for the middleware
  runtime: "edge", // Use Edge runtime for the middleware
};

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value?.trim();
  console.log("Token from cookies:", token);

  if (pathname === "/admin") {
    if (token) {
      try {
        // const secretKey = new TextEncoder().encode(JWT_SECRET);
        // await jwtVerify(token, secretKey);
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || JWT_SECRET || "e8ad46188b56c0b64a9b58262a0e114f8f777bee4e0ff35b7b5f72dda5786f40"));
      } catch (err) {
        console.error("JWT Verification failed. Reason:", err.message);
        const loginUrl = new URL("/admin/login", req.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.set("token", "", { maxAge: -1 });
        return response;
      }
      
    }
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (PROTECTED_ROUTES.test(pathname)) {
    console.log("Middleware Token from cookies:", token);
    if (!token) {
      console.warn("Token is missing or empty");
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify the token using jose
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch (err) {
      console.error("JWT Verification failed:", err);
      const loginUrl = new URL("/admin/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set("token", "", { maxAge: -1 });
      return response;
    }
  }

  return NextResponse.next();
}
