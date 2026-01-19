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
import type { MonthlyPeriod } from "@/app/actions/monthly-periods/types"
import { MonthlyPeriodsRowActions } from "./monthly-periods-row-actions"
import { humanizeMonth } from "@/utils/helpers/humanize-month"
import { MonthlyPeriodsFilters } from "@/components/filters/monthly-periods-filters"
import { useI18n } from "@/components/i18n/i18n-provider"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"

type SortField = "year" | "month" | "updatedAt"
type SortDirection = "ASC" | "DESC"

interface MonthlyPeriodsTableProps {
  monthlyPeriods: MonthlyPeriod[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function MonthlyPeriodsTable({ monthlyPeriods, meta }: MonthlyPeriodsTableProps) {
  const { t } = useI18n()
  const { locale, timeZoneIana } = useUserPreferences()
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
    if (updates.search !== undefined || updates.orderBy !== undefined || updates.order !== undefined || updates.startDate !== undefined || updates.endDate !== undefined) {
      params.set("page", "1")
    }

    startTransition(() => {
      router.push(`/dashboard/monthly-periods?${params.toString()}`)
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

  const formatDateTime = (dateString: string): string => {
    try {
      const d = new Date(dateString)
      return new Intl.DateTimeFormat(locale, {
        timeZone: timeZoneIana,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d)
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Bar and Filters */}
      <div className="flex items-center gap-4">
        <div className="w-1/4">
          <Input
            placeholder={t("monthlyPeriods.search.placeholder")}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <MonthlyPeriodsFilters />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("year")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("monthlyPeriods.table.year")}
                  {getSortIcon("year")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("month")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("monthlyPeriods.table.month")}
                  {getSortIcon("month")}
                </Button>
              </TableHead>
              <TableHead>{t("monthlyPeriods.table.status")}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("updatedAt")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("monthlyPeriods.table.updatedAt")}
                  {getSortIcon("updatedAt")}
                </Button>
              </TableHead>
              <TableHead className="w-16 text-center">
                {t("monthlyPeriods.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyPeriods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("monthlyPeriods.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              monthlyPeriods.map((period) => (
                <TableRow key={period.id}>
                  <TableCell className="font-medium">{period.year}</TableCell>
                  <TableCell>{humanizeMonth(period.month, locale)}</TableCell>
                  <TableCell>
                    {period.isActive ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {t("monthlyPeriods.status.active")}
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">
                        {t("monthlyPeriods.status.inactive")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(period.updatedAt)}</TableCell>
                  <TableCell className="text-center">
                    <MonthlyPeriodsRowActions monthlyPeriod={period} />
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
            from: monthlyPeriods.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0,
            to: Math.min(currentPage * meta.limit, meta.totalObjects),
            total: meta.totalObjects,
            entity: t("monthlyPeriods.title").toLowerCase(),
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

