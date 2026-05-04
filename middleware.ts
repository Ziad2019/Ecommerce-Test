// middleware.ts
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

// ✅ يستخدم authConfig بس - بدون Prisma/bcrypt
const { auth } = NextAuth(authConfig)

const protectedRoutes = ["/account", "/checkout"]
const adminRoutes = ["/admin"]
const authRoutes = ["/login", "/register"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "ADMIN"

  if (authRoutes.some((route) => pathname.startsWith(route)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url))
    // if (!isAdmin) return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
}