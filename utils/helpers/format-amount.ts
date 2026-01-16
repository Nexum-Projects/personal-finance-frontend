/**
 * Convierte centavos a decimales (divide entre 100)
 */
export function centsToDecimal(cents: number): number {
  return cents / 100
}

/**
 * Convierte decimales a centavos (multiplica por 100)
 */
export function decimalToCents(decimal: number): number {
  return Math.round(decimal * 100)
}

/**
 * Formatea un monto en centavos a string con formato de moneda
 */
export function formatAmount(
  cents: number,
  currency: string = "GTQ",
  locale: string = "es-GT"
): string {
  const decimal = centsToDecimal(cents)

  // Compatibilidad hacia atrás: antes se usaba "GT" para Quetzal
  const normalizedCurrency = currency === "GT" ? "GTQ" : currency

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: normalizedCurrency,
  }).format(decimal)
}

