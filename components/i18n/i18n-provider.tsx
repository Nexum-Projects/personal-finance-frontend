"use client"

import * as React from "react"
import type { PreferredLanguage } from "@/utils/user-preferences"
import type { I18nKey, Messages } from "@/utils/i18n/messages"

type I18nContextValue = {
  language: PreferredLanguage
  messages: Messages
  t: (key: I18nKey, vars?: Record<string, string | number>) => string
}

const I18nContext = React.createContext<I18nContextValue | null>(null)

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const v = vars[name]
    return v === undefined || v === null ? `{${name}}` : String(v)
  })
}

export function I18nProvider({
  children,
  language,
  messages,
}: {
  children: React.ReactNode
  language: PreferredLanguage
  messages: Messages
}) {
  const value = React.useMemo<I18nContextValue>(() => {
    return {
      language,
      messages,
      t: (key, vars) => {
        const msg = messages[key] ?? key
        return interpolate(msg, vars)
      },
    }
  }, [language, messages])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = React.useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n debe usarse dentro de <I18nProvider />")
  }
  return ctx
}

