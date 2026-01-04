import type { Account } from "../transactions/types"

export interface AccountSearchParams {
  page?: number
  limit?: number
  order?: "ASC" | "DESC"
  orderBy?: "createdAt" | "updatedAt" | "name" | "accountType" | "currentBalanceCents"
  search?: string
  pagination?: boolean
  startDate?: string
  endDate?: string
}

export interface AccountPageMeta {
  page: number
  limit: number
  totalObjects: number
  totalPages: number
}

export interface AccountPageResponse {
  data: Account[]
  meta: AccountPageMeta
}

export type { Account }

