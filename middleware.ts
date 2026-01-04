import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Manejar solicitudes de service workers (evitar errores 404)
  if (pathname === "/sw.js" || pathname.startsWith("/workbox-")) {
    return new NextResponse(null, { status: 204 }) // No Content
  }

  const session = request.cookies.get("session")?.value

  const isExpired = (token: string): boolean => {
    try {
      const [, payloadB64] = token.split(".")
      if (!payloadB64) return true
      const base64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/")
      const padded =
        base64 + "===".slice((base64.length + 3) % 4) // padding base64
      const payloadJson = atob(padded)
      const payload = JSON.parse(payloadJson) as { exp?: number }
      if (!payload.exp) return false
      return payload.exp * 1000 <= Date.now()
    } catch {
      // Si no se puede decodificar, tratar como inválido/expirado
      return true
    }
  }

  const hasValidSession = !!session && !isExpired(session)

  // Si el token está expirado, limpiar cookies y redirigir a login
  if (session && !hasValidSession) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("session")
    response.cookies.delete("refreshToken")
    return response
  }

  // Si está en login y ya tiene sesión, redirigir a dashboard
  if (pathname === "/login" && hasValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si está en dashboard y no tiene sesión, redirigir a login
  if (pathname.startsWith("/dashboard") && !hasValidSession) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/sw.js", "/workbox-:path*"],
}

