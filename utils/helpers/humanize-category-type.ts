export type CategoryType = "INCOME" | "EXPENSE"

export function humanizeCategoryType(categoryType: CategoryType): string {
  const CATEGORY_TYPES_MAP: Record<CategoryType, string> = {
    INCOME: "Ingreso",
    EXPENSE: "Gasto",
  }

  return CATEGORY_TYPES_MAP[categoryType] || categoryType
}

