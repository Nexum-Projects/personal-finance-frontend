export function humanizeMonth(month: number): string {
  const MONTHS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  if (month >= 1 && month <= 12) {
    return MONTHS[month - 1]
  }

  return `Mes ${month}`
}

export function formatPeriod(year: number, month: number): string {
  return `${humanizeMonth(month)} ${year}`
}

