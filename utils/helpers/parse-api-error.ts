import { humanizeError, type ErrorCode } from "./humanize-error"
import type { HumanizedError } from "./humanize-error"
import { getMessages } from "@/utils/i18n/messages"
import {
  PREFERRED_LANGUAGES,
  type PreferredLanguage,
} from "@/utils/user-preferences"

export interface ApiErrorResponse {
  code?: ErrorCode | string
  message?: string
  statusCode?: number
  type?: string
  details?: Record<string, unknown>
}

// En el navegador, el idioma de la página (<html lang>, que el layout fija según la sesión).
// En el servidor no hay documento: las Server Actions pasan el idioma de la sesión.
function pageLanguage(): PreferredLanguage {
  const lang =
    typeof document === "undefined"
      ? ""
      : document.documentElement.lang.toUpperCase()
  return PREFERRED_LANGUAGES.find((value) => value === lang) ?? "ES"
}

/**
 * Parsea y humaniza un error de la API en el idioma indicado
 */
export function parseApiError(
  error: unknown,
  language: PreferredLanguage = pageLanguage()
): HumanizedError {
  const messages = getMessages(language)

  // Error que una Server Action ya humanizó ({ title, message }): se respeta tal cual.
  if (
    error &&
    typeof error === "object" &&
    !("code" in error) &&
    typeof (error as { title?: unknown }).title === "string" &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    const { title, message } = error as { title: string; message: string }
    return { title, description: message }
  }

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
      apiError.details,
      language
    )
  }

  // Si es un string
  if (typeof error === "string") {
    return {
      title: messages["errors.generic.title"],
      description: error,
    }
  }

  // Si es un objeto con message
  if (error && typeof error === "object" && "message" in error) {
    const err = error as { message?: string; code?: string }
    return humanizeError(
      err.code || "INTERNAL_SERVER_ERROR",
      err.message || messages["errors.unknown.desc"],
      undefined,
      language
    )
  }

  // Error desconocido
  return {
    title: messages["errors.unknown.title"],
    description: messages["errors.unknown.desc"],
  }
}
