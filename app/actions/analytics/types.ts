export interface AnalyticsDateParams {
  startDate?: string // ISO date string (YYYY-MM-DD)
  endDate?: string // ISO date string (YYYY-MM-DD)
}

export interface AnalyticsParams extends AnalyticsDateParams {
  groupBy?: "day" | "week" | "month" | "year"
}

export interface AnalyticsSummary {
  totalIncomeCents: number
  totalExpensesCents: number
  totalBalanceCents: number
  totalAccounts: number
  netAmountCents: number
  growthPercentage: number | null
  savingsCents: number
}

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  totalAmountCents: number
  percentage: number
  transactionCount: number
}

export interface TrendData {
  date: string // ISO date string (YYYY-MM-DD)
  incomeCents: number
  expensesCents: number
  netAmountCents: number
  balanceCents: number
  savingsCents: number
}

export interface AccountBalanceBreakdown {
  accountId: string
  accountName: string
  accountType: string
  balanceCents: number
  percentage: number
}

