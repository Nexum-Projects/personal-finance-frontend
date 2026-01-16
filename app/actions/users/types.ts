export type UserRole = "USER" | "ADMIN"

export type PreferredCurrency = "USD" | "GTQ" | "MXN"
export type TimeZone =
  | "AMERICA_GUATEMALA"
  | "AMERICA_MEXICO_CITY"
  | "AMERICA_MONTERREY"
  | "AMERICA_TIJUANA"
  | "AMERICA_CANCUN"
  | "AMERICA_NEW_YORK"
  | "AMERICA_CHICAGO"
  | "AMERICA_DENVER"
  | "AMERICA_LOS_ANGELES"
  | "AMERICA_PHOENIX"

export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  preferredCurrency: PreferredCurrency
  timeZone: TimeZone
  isActive: boolean
  createdAt: string
  updatedAt: string
}

