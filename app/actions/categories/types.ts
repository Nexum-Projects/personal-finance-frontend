export type CategoryType = "INCOME" | "EXPENSE"

export interface Category {
  id: string
  name: string
  categoryType: CategoryType
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CategorySearchParams {
  page?: number
  limit?: number
  order?: "ASC" | "DESC"
  orderBy?: "createdAt" | "updatedAt" | "name" | "categoryType"
  search?: string
  categoryType?: CategoryType
  pagination?: boolean
}

export interface CategoryPageMeta {
  page: number
  limit: number
  totalObjects: number
  totalPages: number
}

export interface CategoryPageResponse {
  data: Category[]
  meta: CategoryPageMeta
}

