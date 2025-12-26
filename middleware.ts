import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Manejar solicitudes de service workers (evitar errores 404)
  if (pathname === "/sw.js" || pathname.startsWith("/workbox-")) {
    return new NextResponse(null, { status: 204 }) // No Content
  }

  // Obtener el token de la cookie 'session'
  const session = request.cookies.get("session")?.value

  // Si está en login y ya tiene sesión, redirigir a dashboard
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si está en dashboard y no tiene sesión, redirigir a login
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/sw.js", "/workbox-:path*"],
}

