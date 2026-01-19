export type CategoryType = "INCOME" | "EXPENSE"
import type { PreferredLanguage } from "@/utils/user-preferences"

const CATEGORY_TYPES_MAP: Record<PreferredLanguage, Record<CategoryType, string>> = {
  ES: { INCOME: "Ingreso", EXPENSE: "Gasto" },
  EN: { INCOME: "Income", EXPENSE: "Expense" },
  PT: { INCOME: "Receita", EXPENSE: "Despesa" },
}

export function humanizeCategoryType(
  categoryType: CategoryType,
  language: PreferredLanguage = "ES"
): string {
  return CATEGORY_TYPES_MAP[language]?.[categoryType] || categoryType
}

