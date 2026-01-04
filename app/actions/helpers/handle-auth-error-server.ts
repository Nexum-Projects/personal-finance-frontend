"use server"

import { redirect } from "next/navigation"

/**
 * Maneja errores de autenticación en Server Actions / Server Components:
 * Redirige al login.
 *
 * Nota importante (Next.js):
 * `cookies().set/delete` SOLO puede ejecutarse en Server Actions o Route Handlers.
 * Como esta función puede ser llamada desde Server Components (por ejemplo, al renderizar una page),
 * NO modificamos cookies aquí para evitar el error:
 * "Cookies can only be modified in a Server Action or Route Handler".
 */
export async function handleAuthErrorServer(): Promise<never> {
  // Pasar por /logout para limpiar cookies (Route Handler) y luego ir a /login
  redirect("/logout")
}

