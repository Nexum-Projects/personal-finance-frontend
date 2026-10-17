"use client"

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
import { TablePagination } from "@/components/display/table-pagination"
import { useTableSearchParams } from "@/hooks/use-table-search-params"
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

interface CategoriesTableProps {
  categories: Category[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function CategoriesTable({
  categories,
  meta,
}: Readonly<CategoriesTableProps>) {
  const { preferredLanguage } = useUserPreferences()
  const { t } = useI18n()
  const {
    isPending,
    currentPage,
    search,
    handleSearch,
    handleSort,
    handlePageChange,
    getSortIcon,
  } = useTableSearchParams<SortField>("/dashboard/categories")

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
                    {humanizeCategoryType(
                      category.categoryType,
                      preferredLanguage
                    )}
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

      <TablePagination
        currentPage={currentPage}
        totalPages={meta.totalPages}
        limit={meta.limit}
        totalObjects={meta.totalObjects}
        itemCount={categories.length}
        entity={t("categories.title").toLowerCase()}
        disabled={isPending}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
