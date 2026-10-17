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
import { formatAmount } from "@/utils/helpers/format-amount"
import type { MonthlyBudget } from "@/app/actions/monthly-budgets/types"
import { MonthlyBudgetsRowActions } from "./monthly-budgets-row-actions"
import { humanizeCategoryType } from "@/utils/helpers/humanize-category-type"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"
import { TablePagination } from "@/components/display/table-pagination"
import { useTableSearchParams } from "@/hooks/use-table-search-params"

type SortField = "budgetedCents" | "updatedAt"

interface MonthlyBudgetsTableProps {
  monthlyPeriodId: string
  budgets: MonthlyBudget[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function MonthlyBudgetsTable({
  monthlyPeriodId,
  budgets,
  meta,
}: Readonly<MonthlyBudgetsTableProps>) {
  const { preferredCurrency, preferredLanguage, locale, timeZoneIana } =
    useUserPreferences()
  const { t } = useI18n()
  const {
    isPending,
    currentPage,
    search,
    handleSearch,
    handleSort,
    handlePageChange,
    getSortIcon,
  } = useTableSearchParams<SortField>(
    `/dashboard/monthly-periods/${monthlyPeriodId}/budgets`
  )

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
      {/* Search Bar - 1/4 del ancho de la tabla */}
      <div className="flex items-center gap-4">
        <div className="w-1/4">
          <Input
            placeholder={t("monthlyPeriods.budgets.search.placeholder")}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {t("monthlyPeriods.budgets.table.category")}
              </TableHead>
              <TableHead>{t("monthlyPeriods.budgets.table.type")}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("budgetedCents")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("monthlyPeriods.budgets.table.budgeted")}
                  {getSortIcon("budgetedCents")}
                </Button>
              </TableHead>
              <TableHead>{t("monthlyPeriods.budgets.table.status")}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("updatedAt")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("monthlyPeriods.budgets.table.updatedAt")}
                  {getSortIcon("updatedAt")}
                </Button>
              </TableHead>
              <TableHead className="w-16 text-center">
                {t("monthlyPeriods.budgets.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("monthlyPeriods.budgets.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              budgets.map((budget) => {
                return (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">
                      {budget.category.name}
                    </TableCell>
                    <TableCell>
                      {humanizeCategoryType(
                        budget.category.categoryType,
                        preferredLanguage
                      )}
                    </TableCell>
                    <TableCell>
                      {formatAmount(budget.budgetedCents, preferredCurrency)}
                    </TableCell>
                    <TableCell>
                      {budget.isActive ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {t("monthlyPeriods.budgets.status.active")}
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">
                          {t("monthlyPeriods.budgets.status.inactive")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatDateTime(budget.updatedAt)}</TableCell>
                    <TableCell className="text-center">
                      <MonthlyBudgetsRowActions
                        monthlyPeriodId={monthlyPeriodId}
                        budget={budget}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={meta.totalPages}
        limit={meta.limit}
        totalObjects={meta.totalObjects}
        itemCount={budgets.length}
        entity={t("monthlyPeriods.tabs.budgets").toLowerCase()}
        disabled={isPending}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
