type SortDirection = "ASC" | "DESC"

type SearchParams = {
  page?: string
  limit?: string
  order?: string
  orderBy?: string
  search?: string
  categoryType?: string
}

type ParsedSearchParams = {
  page: number
  limit: number
  order: SortDirection
  orderBy: string
  search: string
  categoryType?: "INCOME" | "EXPENSE"
}

export function parseSearchParams(
  searchParams: SearchParams,
  defaults: {
    page?: number
    limit?: number
    order?: SortDirection
    orderBy?: string
    search?: string
  } = {}
): ParsedSearchParams {
  const page = searchParams.page
    ? parseInt(searchParams.page, 10)
    : defaults.page || 1
  const limit = searchParams.limit
    ? parseInt(searchParams.limit, 10)
    : defaults.limit || 10
  const order =
    (searchParams.order?.toUpperCase() as SortDirection) ||
    defaults.order ||
    "ASC"
  const orderBy = searchParams.orderBy || defaults.orderBy || "createdAt"
  const search = searchParams.search || defaults.search || ""
  const categoryType =
    searchParams.categoryType === "INCOME" || searchParams.categoryType === "EXPENSE"
      ? searchParams.categoryType
      : undefined

  return {
    page: page > 0 ? page : 1,
    limit: limit > 0 ? limit : 10,
    order: order === "ASC" || order === "DESC" ? order : "ASC",
    orderBy,
    search,
    categoryType,
  }
}

