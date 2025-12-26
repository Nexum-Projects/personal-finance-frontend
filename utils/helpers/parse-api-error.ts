import { humanizeError, type ErrorCode } from "./humanize-error"
import type { HumanizedError } from "./humanize-error"

export interface ApiErrorResponse {
  code?: ErrorCode | string
  message?: string
  statusCode?: number
  type?: string
  details?: Record<string, unknown>
}

/**
 * Parsea y humaniza un error de la API
 */
export function parseApiError(error: unknown): HumanizedError {
  // Si es un objeto con estructura de ErrorDTO
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error
  ) {
    const apiError = error as ApiErrorResponse
    return humanizeError(
      apiError.code || "INTERNAL_SERVER_ERROR",
      apiError.message,
      apiError.details
    )
  }

  // Si es un string
  if (typeof error === "string") {
    return {
      title: "Error",
      description: error,
    }
  }

  // Si es un objeto con message
  if (error && typeof error === "object" && "message" in error) {
    const err = error as { message?: string; code?: string }
    return humanizeError(
      err.code || "INTERNAL_SERVER_ERROR",
      err.message || "Ocurrió un error inesperado"
    )
  }

  // Error desconocido
  return {
    title: "Error desconocido",
    description: "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
  }
}

