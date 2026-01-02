import type { Category } from "../categories/types"

export interface MonthlyBudget {
  id: string
  budgetedCents: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  monthlyPeriod: {
    id: string
    year: number
    month: number
  }
  category: Category
}

export interface MonthlyBudgetSearchParams {
  page?: number
  limit?: number
  order?: "ASC" | "DESC"
  orderBy?: "createdAt" | "updatedAt" | "budgetedCents"
  search?: string
  monthlyPeriodId?: string
  pagination?: boolean
}

export interface MonthlyBudgetPageMeta {
  page: number
  limit: number
  totalObjects: number
  totalPages: number
}

export interface MonthlyBudgetPageResponse {
  data: MonthlyBudget[]
  meta: MonthlyBudgetPageMeta
}

