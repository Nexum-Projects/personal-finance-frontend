export function humanizeAccountType(accountType: string): string {
  const ACCOUNT_TYPES_MAP: Record<string, string> = {
    CASH: "Efectivo",
    BANK: "Banco",
    SAVINGS: "Ahorros",
    CHECKING: "Corriente",
    CREDIT_CARD: "Tarjeta de Crédito",
    CREDIT: "Crédito",
    INVESTMENT: "Inversión",
    LOAN: "Préstamo",
  }

  // Convertir a mayúsculas para hacer la búsqueda case-insensitive
  const upperType = accountType.toUpperCase()
  return ACCOUNT_TYPES_MAP[upperType] || accountType
}

