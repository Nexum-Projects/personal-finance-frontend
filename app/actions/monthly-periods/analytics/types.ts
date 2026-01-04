export interface MonthlyPeriodAnalytics {
  monthlyPeriodId: string
  year: number
  month: number
  initialSavingCents: number
  incomeCents: number
  expensesCents: number
  balanceCents: number
  finalSavingCents: number
  accumulatedSavingCents: number
}

export interface MonthlyPeriodAnalyticsResponse {
  data: MonthlyPeriodAnalytics[]
}

