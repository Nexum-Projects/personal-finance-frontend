import type { PreferredLanguage } from "@/utils/user-preferences"

const ACCOUNT_TYPES_MAP: Record<PreferredLanguage, Record<string, string>> = {
  ES: {
    CASH: "Efectivo",
    BANK: "Banco",
    SAVINGS: "Ahorros",
    CHECKING: "Corriente",
    CREDIT_CARD: "Tarjeta de Crédito",
    CREDIT: "Crédito",
    INVESTMENT: "Inversión",
    LOAN: "Préstamo",
    OTHER: "Otro",
  },
  EN: {
    CASH: "Cash",
    BANK: "Bank",
    SAVINGS: "Savings",
    CHECKING: "Checking",
    CREDIT_CARD: "Credit Card",
    CREDIT: "Credit",
    INVESTMENT: "Investment",
    LOAN: "Loan",
    OTHER: "Other",
  },
  PT: {
    CASH: "Dinheiro",
    BANK: "Banco",
    SAVINGS: "Poupança",
    CHECKING: "Conta corrente",
    CREDIT_CARD: "Cartão de crédito",
    CREDIT: "Crédito",
    INVESTMENT: "Investimento",
    LOAN: "Empréstimo",
    OTHER: "Outro",
  },
}

export function humanizeAccountType(accountType: string, language: PreferredLanguage = "ES"): string {
  // Convertir a mayúsculas para hacer la búsqueda case-insensitive
  const upperType = accountType.toUpperCase()
  return ACCOUNT_TYPES_MAP[language]?.[upperType] || accountType
}

