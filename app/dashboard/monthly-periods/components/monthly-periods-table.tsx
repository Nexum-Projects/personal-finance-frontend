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
import type { MonthlyPeriod } from "@/app/actions/monthly-periods/types"
import { MonthlyPeriodsRowActions } from "./monthly-periods-row-actions"
import { humanizeMonth } from "@/utils/helpers/humanize-month"
import { MonthlyPeriodsFilters } from "@/components/filters/monthly-periods-filters"
import { useI18n } from "@/components/i18n/i18n-provider"
import { TablePagination } from "@/components/display/table-pagination"
import { useTableSearchParams } from "@/hooks/use-table-search-params"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"

type SortField = "year" | "month" | "updatedAt"

interface MonthlyPeriodsTableProps {
  monthlyPeriods: MonthlyPeriod[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function MonthlyPeriodsTable({
  monthlyPeriods,
  meta,
}: Readonly<MonthlyPeriodsTableProps>) {
  const { t } = useI18n()
  const { locale, timeZoneIana } = useUserPreferences()
  const {
    isPending,
    currentPage,
    search,
    handleSearch,
    handleSort,
    handlePageChange,
    getSortIcon,
  } = useTableSearchParams<SortField>("/dashboard/monthly-periods")

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

      <TablePagination
        currentPage={currentPage}
        totalPages={meta.totalPages}
        limit={meta.limit}
        totalObjects={meta.totalObjects}
        itemCount={monthlyPeriods.length}
        entity={t("monthlyPeriods.title").toLowerCase()}
        disabled={isPending}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
