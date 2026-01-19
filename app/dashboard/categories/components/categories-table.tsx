"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { humanizeCategoryType } from "@/utils/helpers/humanize-category-type"
import type { Category } from "@/app/actions/categories/types"
import { CategoriesRowActions } from "./categories-row-actions"
import { CategoriesFilters } from "@/components/filters/categories-filters"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"
// Formateo de fecha simple sin dependencias externas
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${day}/${month}/${year} ${hours}:${minutes}`
  } catch {
    return dateString
  }
}

type SortField = "name" | "categoryType" | "updatedAt"
type SortDirection = "ASC" | "DESC"

interface CategoriesTableProps {
  categories: Category[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function CategoriesTable({ categories, meta }: CategoriesTableProps) {
  const { preferredLanguage } = useUserPreferences()
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const currentSearch = searchParams.get("search") || ""
  const currentOrderBy = (searchParams.get("orderBy") || "updatedAt") as SortField
  const currentOrder = (searchParams.get("order") || "DESC") as SortDirection

  const [search, setSearch] = useState(currentSearch)

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    // Reset to page 1 when search, sort, or filters change
    if (
      updates.search !== undefined ||
      updates.orderBy !== undefined ||
      updates.order !== undefined ||
      updates.startDate !== undefined ||
      updates.endDate !== undefined ||
      updates.categoryType !== undefined
    ) {
      params.set("page", "1")
    }

    startTransition(() => {
      router.push(`/dashboard/categories?${params.toString()}`)
    })
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    updateSearchParams({ search: value || null })
  }

  const handleSort = (field: SortField) => {
    const newOrder =
      currentOrderBy === field && currentOrder === "ASC" ? "DESC" : "ASC"
    updateSearchParams({
      orderBy: field,
      order: newOrder,
    })
  }

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() })
  }

  const getSortIcon = (field: SortField) => {
    if (currentOrderBy !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return currentOrder === "ASC" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    )
  }


  return (
    <div className="space-y-4">
      {/* Search Bar and Filters */}
      <div className="flex items-center gap-4">
        <div className="w-1/4">
          <Input
            placeholder={t("categories.searchPlaceholder")}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <CategoriesFilters />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("categories.table.name")}
                  {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("categoryType")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("categories.table.type")}
                  {getSortIcon("categoryType")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("updatedAt")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("categories.table.updatedAt")}
                  {getSortIcon("updatedAt")}
                </Button>
              </TableHead>
              <TableHead className="w-16 text-center">
                {t("categories.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {t("categories.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {humanizeCategoryType(category.categoryType, preferredLanguage)}
                  </TableCell>
                  <TableCell>{formatDate(category.updatedAt)}</TableCell>
                  <TableCell className="text-center">
                    <CategoriesRowActions category={category} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("pagination.showing", {
            from: categories.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0,
            to: Math.min(currentPage * meta.limit, meta.totalObjects),
            total: meta.totalObjects,
            entity: t("categories.title").toLowerCase(),
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isPending}
          >
            {t("pagination.prev")}
          </Button>
          <div className="text-sm text-foreground">
            {t("pagination.pageOf", { page: currentPage, totalPages: meta.totalPages })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= meta.totalPages || isPending}
          >
            {t("pagination.next")}
          </Button>
        </div>
      </div>
    </div>
  )
}

