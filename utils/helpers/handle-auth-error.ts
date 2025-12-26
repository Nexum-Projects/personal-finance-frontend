"use client"

import { toast } from "sonner"
import { parseApiError } from "./parse-api-error"
import { isAxiosError } from "axios"

/**
 * Maneja errores de autenticación (401, 403) y cierra sesión automáticamente
 * Puede recibir:
 * - Un error de axios directamente
 * - Un objeto de error de ActionResponse
 * - Un código de error de la API
 */
export function handleAuthError(
  error: unknown,
  router?: any
): boolean {
  // Si es un error de axios con respuesta 401/403
  if (isAxiosError(error) && error.response) {
    const status = error.response.status
    if (status === 401 || status === 403) {
      return performLogout(error.response.data, router)
    }
  }

  // Si es un objeto de error de ActionResponse con código AUTH_ERROR
  if (
    error &&
    typeof error === "object" &&
    "code" in error
  ) {
    const err = error as { code?: string; statusCode?: number }
    if (
      err.code === "AUTH_ERROR" ||
      err.statusCode === 401 ||
      err.statusCode === 403
    ) {
      return performLogout(error, router)
    }
  }

  // Si es un objeto con código de error UNAUTHORIZED o FORBIDDEN
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (typeof error.code === "string" &&
      (error.code.includes("UNAUTHORIZED") ||
        error.code.includes("FORBIDDEN") ||
        error.code.includes("TOKEN_EXPIRED")))
  ) {
    return performLogout(error, router)
  }

  return false
}

function performLogout(errorData: unknown, router?: any): boolean {
  // Eliminar cookies del cliente
  if (typeof document !== "undefined") {
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  }

  const humanizedError = parseApiError(errorData)
  toast.error(humanizedError.title, {
    description: humanizedError.description,
  })

  // Redirigir a login
  if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
    if (router) {
      router.push("/login")
      router.refresh()
    } else {
      window.location.href = "/login"
    }
  }

  return true
}

