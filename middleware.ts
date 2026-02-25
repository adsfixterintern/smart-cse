import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    let userHome = "/dashboard" 
    if (token?.role === "admin") userHome = "/admin"
    if (token?.role === "teacher") userHome = "/teacher"


    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL(userHome, req.url))
    }

    if (path.startsWith("/teacher") && token?.role !== "teacher") {
      return NextResponse.redirect(new URL(userHome, req.url))
    }

 
    if (path.startsWith("/dashboard") && token?.role !== "student" && token?.role !== undefined) {
      return NextResponse.redirect(new URL(userHome, req.url))  
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/dashboard/:path*"],
}