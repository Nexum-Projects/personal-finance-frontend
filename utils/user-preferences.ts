export const PREFERRED_CURRENCIES = ["USD", "GTQ", "MXN"] as const
export type PreferredCurrency = (typeof PREFERRED_CURRENCIES)[number]

export const TIME_ZONES = [
  "AMERICA_GUATEMALA",
  "AMERICA_MEXICO_CITY",
  "AMERICA_MONTERREY",
  "AMERICA_TIJUANA",
  "AMERICA_CANCUN",
  "AMERICA_NEW_YORK",
  "AMERICA_CHICAGO",
  "AMERICA_DENVER",
  "AMERICA_LOS_ANGELES",
  "AMERICA_PHOENIX",
] as const
export type TimeZone = (typeof TIME_ZONES)[number]

export const DEFAULT_PREFERRED_CURRENCY: PreferredCurrency = "GTQ"
export const DEFAULT_TIME_ZONE: TimeZone = "AMERICA_GUATEMALA"

export type UserPreferences = {
  preferredCurrency: PreferredCurrency
  timeZone: TimeZone
}

export const PREFERRED_CURRENCY_LABEL: Record<PreferredCurrency, string> = {
  USD: "USD",
  GTQ: "Quetzal (GTQ)",
  MXN: "Peso (MXN)",
}

export const TIME_ZONE_TO_IANA: Record<TimeZone, string> = {
  AMERICA_GUATEMALA: "America/Guatemala",
  AMERICA_MEXICO_CITY: "America/Mexico_City",
  AMERICA_MONTERREY: "America/Monterrey",
  AMERICA_TIJUANA: "America/Tijuana",
  AMERICA_CANCUN: "America/Cancun",
  AMERICA_NEW_YORK: "America/New_York",
  AMERICA_CHICAGO: "America/Chicago",
  AMERICA_DENVER: "America/Denver",
  AMERICA_LOS_ANGELES: "America/Los_Angeles",
  AMERICA_PHOENIX: "America/Phoenix",
}

export function timeZoneToIana(timeZone: TimeZone): string {
  return TIME_ZONE_TO_IANA[timeZone]
}

export function parsePreferredCurrency(value: unknown): PreferredCurrency | null {
  if (typeof value !== "string") return null
  return (PREFERRED_CURRENCIES as readonly string[]).includes(value)
    ? (value as PreferredCurrency)
    : null
}

export function parseTimeZone(value: unknown): TimeZone | null {
  if (typeof value !== "string") return null
  return (TIME_ZONES as readonly string[]).includes(value) ? (value as TimeZone) : null
}

export function getPreferencesFromClaims(
  claims: Record<string, unknown> | null | undefined
): UserPreferences {
  const preferredCurrency = parsePreferredCurrency(claims?.preferredCurrency) ?? DEFAULT_PREFERRED_CURRENCY
  const timeZone = parseTimeZone(claims?.timeZone) ?? DEFAULT_TIME_ZONE
  return { preferredCurrency, timeZone }
}

