export interface MonthlyBudgetAnalyticsByPeriodItem {
  monthlyBudgetId: string
  categoryId: string
  categoryName: string
  budgetedCents: number
  spentCents: number
  remainingCents: number
}

export interface MonthlyBudgetAnalyticsByPeriodResponse {
  data: MonthlyBudgetAnalyticsByPeriodItem[]
}


