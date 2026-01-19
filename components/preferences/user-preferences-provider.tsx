"use client"

import * as React from "react"

import type { UserPreferences } from "@/utils/user-preferences"
import { languageToLocale, timeZoneToIana } from "@/utils/user-preferences"

type UserPreferencesContextValue = UserPreferences & {
  timeZoneIana: string
  locale: string
}

const UserPreferencesContext = React.createContext<UserPreferencesContextValue | null>(null)

export function UserPreferencesProvider({
  children,
  preferences,
}: {
  children: React.ReactNode
  preferences: UserPreferences
}) {
  const value = React.useMemo<UserPreferencesContextValue>(() => {
    return {
      ...preferences,
      timeZoneIana: timeZoneToIana(preferences.timeZone),
      locale: languageToLocale(preferences.preferredLanguage),
    }
  }, [preferences])

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences(): UserPreferencesContextValue {
  const ctx = React.useContext(UserPreferencesContext)
  if (!ctx) {
    throw new Error("useUserPreferences debe usarse dentro de <UserPreferencesProvider />")
  }
  return ctx
}

