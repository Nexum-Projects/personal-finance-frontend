/**
 * Devuelve el nombre del mes según locale (por default: es-GT).
 * month: 1..12
 */
export function humanizeMonth(month: number, locale: string = "es-GT"): string {
  if (month >= 1 && month <= 12) {
    // Usamos una fecha fija para sacar el nombre del mes en el locale.
    const d = new Date(2020, month - 1, 1)
    return new Intl.DateTimeFormat(locale, { month: "long" }).format(d)
  }
  return locale.startsWith("en") ? `Month ${month}` : `Mes ${month}`
}

export function formatPeriod(year: number, month: number, locale: string = "es-GT"): string {
  // Capitalizar primera letra para que se vea consistente entre locales.
  const m = humanizeMonth(month, locale)
  const mCap = m.length ? m[0].toUpperCase() + m.slice(1) : m
  return `${mCap} ${year}`
}

