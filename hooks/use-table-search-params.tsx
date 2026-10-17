"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

type SortDirection = "ASC" | "DESC"

interface Options<F extends string> {
  defaultOrderBy?: F | ""
  defaultOrder?: SortDirection
}

/**
 * Página, búsqueda y orden de una tabla paginada guardados en la URL.
 * Cualquier cambio que no sea de página vuelve a la página 1.
 */
export function useTableSearchParams<F extends string>(
  basePath: string,
  { defaultOrderBy = "updatedAt" as F, defaultOrder = "DESC" }: Options<F> = {}
) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)
  const currentOrderBy = (searchParams.get("orderBy") || defaultOrderBy) as
    | F
    | ""
  const currentOrder = (
    searchParams.get("order") || defaultOrder
  ).toUpperCase() as SortDirection

  const [search, setSearch] = useState(searchParams.get("search") || "")

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    if (updates.page === undefined) {
      params.set("page", "1")
    }

    startTransition(() => {
      router.push(`${basePath}?${params.toString()}`)
    })
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    updateSearchParams({ search: value || null })
  }

  const handleSort = (field: F) => {
    const newOrder =
      currentOrderBy === field && currentOrder === "ASC" ? "DESC" : "ASC"
    updateSearchParams({ orderBy: field, order: newOrder })
  }

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() })
  }

  const getSortIcon = (field: F) => {
    if (currentOrderBy !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return currentOrder === "ASC" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    )
  }

  return {
    searchParams,
    isPending,
    currentPage,
    search,
    updateSearchParams,
    handleSearch,
    handleSort,
    handlePageChange,
    getSortIcon,
  }
}
