import getSession from "@/app/actions/auth/getSession"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { DashboardShell } from "./components/dashboard-shell"
import { getLanguageFromSession } from "@/utils/i18n/get-language-from-session"
import { getMessages } from "@/utils/i18n/messages"
import { getPreferencesFromClaims } from "@/utils/user-preferences"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const language = getLanguageFromSession(
    session as Record<string, unknown> | null
  )
  const messages = getMessages(language)
  const preferences = getPreferencesFromClaims(
    session as Record<string, unknown> | null
  )

  return (
    <I18nProvider language={language} messages={messages}>
      <DashboardShell preferences={preferences}>{children}</DashboardShell>
    </I18nProvider>
  )
}
