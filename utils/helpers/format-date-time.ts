/**
 * Formatea fecha y hora (ej. "21/01/2026, 13:20") en la zona horaria indicada.
 * El reloj de 24 h es explícito: Node y el navegador usan datos de idioma
 * distintos y, sin fijarlo, el HTML del servidor no coincide con el del cliente.
 */
export function formatDateTime(
  dateString: string,
  locale: string,
  timeZone: string
): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(new Date(dateString))
  } catch {
    return dateString
  }
}
