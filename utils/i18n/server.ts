import getSession from "@/app/actions/auth/getSession"
import type { I18nKey, Messages } from "@/utils/i18n/messages"
import { getMessages } from "@/utils/i18n/messages"
import { getLanguageFromSession } from "@/utils/i18n/get-language-from-session"
import type { PreferredLanguage } from "@/utils/user-preferences"

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const v = vars[name]
    return v === undefined || v === null ? `{${name}}` : String(v)
  })
}

export async function getServerI18n(): Promise<{
  language: PreferredLanguage
  messages: Messages
  t: (key: I18nKey, vars?: Record<string, string | number>) => string
}> {
  const session = await getSession()
  const language = getLanguageFromSession(session as Record<string, unknown> | null)
  const messages = getMessages(language)
  return {
    language,
    messages,
    t: (key, vars) => interpolate(messages[key] ?? key, vars),
  }
}

