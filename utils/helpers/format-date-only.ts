/**
 * Formatea una fecha en formato YYYY-MM-DD a formato local sin conversión de zona horaria
 * Útil para fechas que vienen del backend sin información de hora
 */
export function formatDateOnly(dateString: string, locale: string = "es-GT"): string {
  try {
    // Si la fecha viene en formato YYYY-MM-DD, parsearla directamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-").map(Number)
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
      })
    }
    
    // Si tiene información de hora, usar el método normal pero en zona horaria de Guatemala
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      timeZone: "America/Guatemala",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

/**
 * Formatea una fecha en formato YYYY-MM-DD a formato DD/MM/YYYY sin conversión de zona horaria
 */
export function formatDateOnlyShort(dateString: string): string {
  try {
    // Si la fecha viene en formato YYYY-MM-DD, parsearla directamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-").map(Number)
      return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`
    }
    
    // Si tiene información de hora, usar el método normal pero en zona horaria de Guatemala
    const date = new Date(dateString)
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Guatemala",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    return formatter.format(date)
  } catch {
    return dateString
  }
}

