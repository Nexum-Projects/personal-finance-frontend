import type { ReactNode } from "react"
import { expect, type Mock } from "vitest"
import { render } from "@testing-library/react"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { UserPreferencesProvider } from "@/components/preferences/user-preferences-provider"
import { ES_MESSAGES } from "@/utils/i18n/messages"

export const es = (key: keyof typeof ES_MESSAGES) => ES_MESSAGES[key]

export function meta(totalPages = 50) {
  return { page: 1, limit: 10, totalObjects: totalPages * 10, totalPages }
}

export function renderWithProviders(ui: ReactNode) {
  return render(
    <I18nProvider language="ES" messages={ES_MESSAGES}>
      <UserPreferencesProvider
        preferences={{
          preferredCurrency: "GTQ",
          timeZone: "AMERICA_GUATEMALA",
          preferredLanguage: "ES",
        }}
      >
        {ui}
      </UserPreferencesProvider>
    </I18nProvider>
  )
}

export function lastPushedParams(push: Mock, basePath: string) {
  const url: string = push.mock.calls.at(-1)?.[0]
  expect(url.startsWith(`${basePath}?`)).toBe(true)
  return new URLSearchParams(url.split("?")[1])
}
