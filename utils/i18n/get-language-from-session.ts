import type { PreferredLanguage } from "@/utils/user-preferences"
import { DEFAULT_PREFERRED_LANGUAGE, parsePreferredLanguage } from "@/utils/user-preferences"

export function getLanguageFromSession(
  session: Record<string, unknown> | null | undefined
): PreferredLanguage {
  return parsePreferredLanguage(session?.preferredLanguage) ?? DEFAULT_PREFERRED_LANGUAGE
}

