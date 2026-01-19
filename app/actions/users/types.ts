export type UserRole = "USER" | "ADMIN"

import type { PreferredCurrency, TimeZone, PreferredLanguage } from "@/utils/user-preferences"
export type { PreferredCurrency, TimeZone, PreferredLanguage } from "@/utils/user-preferences"

export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  preferredCurrency: PreferredCurrency
  timeZone: TimeZone
  preferredLanguage: PreferredLanguage
  isActive: boolean
  createdAt: string
  updatedAt: string
}

