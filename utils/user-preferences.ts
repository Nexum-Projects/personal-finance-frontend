export const PREFERRED_CURRENCIES = ["USD", "GTQ", "MXN"] as const
export type PreferredCurrency = (typeof PREFERRED_CURRENCIES)[number]

export const PREFERRED_LANGUAGES = ["ES", "EN", "PT"] as const
export type PreferredLanguage = (typeof PREFERRED_LANGUAGES)[number]

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
  "AMERICA_COSTA_RICA",
  "AMERICA_EL_SALVADOR",
  "AMERICA_MANAGUA",
  "AMERICA_PANAMA",
  "AMERICA_BOGOTA",
  "AMERICA_LIMA",
  "AMERICA_LA_PAZ",
  "AMERICA_SANTIAGO",
  "AMERICA_BUENOS_AIRES",
  "AMERICA_MONTEVIDEO",
  "AMERICA_ASUNCION",
  "AMERICA_CARACAS",
  "AMERICA_SANTO_DOMINGO",
  "AMERICA_HAVANA",
  "AMERICA_SAO_PAULO",
] as const
export type TimeZone = (typeof TIME_ZONES)[number]

export const DEFAULT_PREFERRED_CURRENCY: PreferredCurrency = "GTQ"
export const DEFAULT_TIME_ZONE: TimeZone = "AMERICA_GUATEMALA"
export const DEFAULT_PREFERRED_LANGUAGE: PreferredLanguage = "ES"

export type UserPreferences = {
  preferredCurrency: PreferredCurrency
  timeZone: TimeZone
  preferredLanguage: PreferredLanguage
}

export const PREFERRED_CURRENCY_LABEL: Record<PreferredCurrency, string> = {
  USD: "USD",
  GTQ: "Quetzal (GTQ)",
  MXN: "Peso (MXN)",
}

export const PREFERRED_LANGUAGE_LABEL: Record<PreferredLanguage, string> = {
  ES: "Español",
  EN: "English",
  PT: "Português",
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
  AMERICA_COSTA_RICA: "America/Costa_Rica",
  AMERICA_EL_SALVADOR: "America/El_Salvador",
  AMERICA_MANAGUA: "America/Managua",
  AMERICA_PANAMA: "America/Panama",
  AMERICA_BOGOTA: "America/Bogota",
  AMERICA_LIMA: "America/Lima",
  AMERICA_LA_PAZ: "America/La_Paz",
  AMERICA_SANTIAGO: "America/Santiago",
  AMERICA_BUENOS_AIRES: "America/Argentina/Buenos_Aires",
  AMERICA_MONTEVIDEO: "America/Montevideo",
  AMERICA_ASUNCION: "America/Asuncion",
  AMERICA_CARACAS: "America/Caracas",
  AMERICA_SANTO_DOMINGO: "America/Santo_Domingo",
  AMERICA_HAVANA: "America/Havana",
  AMERICA_SAO_PAULO: "America/Sao_Paulo",
}

export function timeZoneToIana(timeZone: TimeZone): string {
  return TIME_ZONE_TO_IANA[timeZone]
}

export const LANGUAGE_TO_LOCALE: Record<PreferredLanguage, string> = {
  ES: "es-GT",
  EN: "en-US",
  PT: "pt-BR",
}

export function languageToLocale(language: PreferredLanguage): string {
  return LANGUAGE_TO_LOCALE[language]
}

export function parsePreferredCurrency(value: unknown): PreferredCurrency | null {
  if (typeof value !== "string") return null
  return (PREFERRED_CURRENCIES as readonly string[]).includes(value)
    ? (value as PreferredCurrency)
    : null
}

export function parsePreferredLanguage(value: unknown): PreferredLanguage | null {
  if (typeof value !== "string") return null
  return (PREFERRED_LANGUAGES as readonly string[]).includes(value)
    ? (value as PreferredLanguage)
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
  const preferredLanguage =
    parsePreferredLanguage(claims?.preferredLanguage) ?? DEFAULT_PREFERRED_LANGUAGE
  return { preferredCurrency, timeZone, preferredLanguage }
}

