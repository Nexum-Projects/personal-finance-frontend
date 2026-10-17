import { isAxiosError } from "axios"
import type { ErrorResponse } from "../types"
import { handleAuthErrorServer } from "./handle-auth-error-server"
import { parseSessionApiError } from "./parse-session-api-error"

/**
 * Respuesta de error de una Server Action, con el mensaje en el idioma de la sesión.
 * Con `redirectOnAuthError`, un 401/403 del API redirige al login; con `withStatusCode`,
 * el error incluye el estado HTTP de la respuesta del API.
 */
export async function actionError(
  error: unknown,
  { redirectOnAuthError = false, withStatusCode = false } = {}
): Promise<ErrorResponse> {
  const response = isAxiosError(error) ? error.response : undefined

  if (
    redirectOnAuthError &&
    (response?.status === 401 || response?.status === 403)
  ) {
    await handleAuthErrorServer()
  }

  const humanizedError = await parseSessionApiError(
    response ? response.data : error
  )
  return {
    status: "error",
    errors: [
      {
        title: humanizedError.title,
        message: humanizedError.description,
        ...(withStatusCode && response ? { statusCode: response.status } : {}),
      },
    ],
  }
}
