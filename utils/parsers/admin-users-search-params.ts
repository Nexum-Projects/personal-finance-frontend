import type { AdminUsersOrderBy } from "@/app/actions/users/types"

const ALLOWED_ORDER_BY = new Set<string>([
  "createdAt",
  "updatedAt",
  "username",
  "email",
  "role",
  "isActive",
])

export type ParsedAdminUsersSearchParams = {
  page: number
  limit: number
  order: "ASC" | "DESC"
  search: string
  orderBy?: AdminUsersOrderBy
}

export function parseAdminUsersSearchParams(searchParams: {
  page?: string
  limit?: string
  order?: string
  orderBy?: string
  search?: string
}): ParsedAdminUsersSearchParams {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1)
  const limit = Math.max(1, parseInt(searchParams.limit || "10", 10) || 10)
  const orderRaw = searchParams.order?.toUpperCase()
  const order = orderRaw === "DESC" ? "DESC" : "ASC"
  const search = searchParams.search?.trim() ?? ""
  const ob = searchParams.orderBy
  const orderBy =
    ob && ALLOWED_ORDER_BY.has(ob) ? (ob as AdminUsersOrderBy) : undefined

  return { page, limit, order, search, orderBy }
}
