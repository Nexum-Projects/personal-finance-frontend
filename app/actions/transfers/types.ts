export interface Transfer {
  id: string
  amountCents: number
  description: string
  transferDate: string
  fromAccountId: string
  toAccountId: string
  fromAccount: {
    id: string
    name: string
  }
  toAccount: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface TransferSearchParams {
  page?: number
  limit?: number
  order?: "ASC" | "DESC"
  orderBy?: "createdAt" | "updatedAt" | "transferDate" | "amountCents"
  search?: string
  pagination?: boolean
  startDate?: string
  endDate?: string
}

export interface TransferPageMeta {
  page: number
  limit: number
  totalObjects: number
  totalPages: number
}

export interface TransferPageResponse {
  data: Transfer[]
  meta: TransferPageMeta
}

