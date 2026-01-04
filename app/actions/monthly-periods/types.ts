export interface MonthlyPeriod {
  id: string
  year: number
  month: number
  initialSavingCents: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MonthlyPeriodSearchParams {
  page?: number
  limit?: number
  order?: "ASC" | "DESC"
  orderBy?: "createdAt" | "updatedAt" | "year" | "month"
  search?: string
  pagination?: boolean
  startDate?: string
  endDate?: string
}

export interface MonthlyPeriodPageMeta {
  page: number
  limit: number
  totalObjects: number
  totalPages: number
}

export interface MonthlyPeriodPageResponse {
  data: MonthlyPeriod[]
  meta: MonthlyPeriodPageMeta
}

