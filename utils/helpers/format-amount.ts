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
export function formatAmount(cents: number, currency: string = "GT"): string {
  const decimal = centsToDecimal(cents)
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: currency === "GT" ? "GTQ" : "USD",
  }).format(decimal)
}

