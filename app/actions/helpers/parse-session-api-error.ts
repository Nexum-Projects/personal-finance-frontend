import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import type { HumanizedError } from "@/utils/helpers/humanize-error"

/**
 * `parseApiError` en el idioma de la sesión, para Server Actions.
 * Sin sesión (login, registro) usa el idioma por defecto.
 * Sin "use server": no es una acción expuesta, solo se importa desde otras Server Actions.
 */
export async function parseSessionApiError(
  error: unknown
): Promise<HumanizedError> {
  const { preferredLanguage } = await getSessionPreferences()
  return parseApiError(error, preferredLanguage)
}
