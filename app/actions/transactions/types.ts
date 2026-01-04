export type CategoryType = "INCOME" | "EXPENSE"

export interface Category {
  id: string
  name: string
  categoryType: CategoryType
  createdAt: string
  updatedAt: string
}

export interface Account {
  id: string
  name: string
  accountType: string
  currentBalanceCents: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  amountCents: number
  description: string
  transactionDate: string
  createdAt: string
  updatedAt: string
  category: Category
  account: Account
}

export interface TransactionSearchParams {
  page?: number
  limit?: number
  order?: "ASC" | "DESC"
  orderBy?: "createdAt" | "updatedAt" | "transactionDate" | "amountCents"
  search?: string
  categoryType?: CategoryType
  pagination?: boolean
  startDate?: string
  endDate?: string
  categoryId?: string
  accountId?: string
}

export interface TransactionPageMeta {
  page: number
  limit: number
  totalObjects: number
  totalPages: number
}

export interface TransactionPageResponse {
  data: Transaction[]
  meta: TransactionPageMeta
}

