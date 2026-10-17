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
import { formatTransactionDateAsIs } from "@/utils/helpers/format-date-only"
import type {
  Transaction,
  Category,
  Account,
} from "@/app/actions/transactions/types"
import { TransactionsRowActions } from "../../expenses/components/transactions-row-actions"
import { TransactionsFilters } from "@/components/filters/transactions-filters"
import { TransactionsExportAction } from "./transactions-export-action"
import { cn } from "@/lib/utils"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"
import { TablePagination } from "@/components/display/table-pagination"
import { useTableSearchParams } from "@/hooks/use-table-search-params"

type SortField = "amountCents" | "transactionDate" | "createdAt" | "updatedAt"

interface AllTransactionsTableProps {
  transactions: Transaction[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
  basePath: string
  categories?: Category[]
  accounts?: Account[]
}

export function AllTransactionsTable({
  transactions,
  meta,
  basePath,
  categories = [],
  accounts = [],
}: Readonly<AllTransactionsTableProps>) {
  const { preferredCurrency } = useUserPreferences()
  const { t } = useI18n()
  const {
    isPending,
    currentPage,
    search,
    handleSearch,
    handleSort,
    handlePageChange,
    getSortIcon,
  } = useTableSearchParams<SortField>(basePath)

  return (
    <div className="space-y-4">
      {/* Search Bar and Filters */}
      <div className="flex items-center gap-4">
        <div className="w-1/4">
          <Input
            placeholder={t("transactions.search.all")}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <TransactionsFilters
          startDateParamName="startDate"
          endDateParamName="endDate"
          categories={categories}
          accounts={accounts}
        />
        <TransactionsExportAction />
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => handleSort("amountCents")}
                >
                  {t("transactions.table.amount")}
                  {getSortIcon("amountCents")}
                </Button>
              </TableHead>
              <TableHead>{t("transactions.table.description")}</TableHead>
              <TableHead>{t("transactions.table.category")}</TableHead>
              <TableHead>{t("transactions.table.account")}</TableHead>
              <TableHead>{t("transactions.table.type")}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => handleSort("transactionDate")}
                >
                  {t("transactions.table.date")}
                  {getSortIcon("transactionDate")}
                </Button>
              </TableHead>
              <TableHead className="text-center">
                {t("transactions.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("transactions.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => {
                const isIncome = transaction.category.categoryType === "INCOME"
                const amountDisplay = isIncome
                  ? `+${formatAmount(transaction.amountCents, preferredCurrency)}`
                  : `-${formatAmount(transaction.amountCents, preferredCurrency)}`

                return (
                  <TableRow key={transaction.id}>
                    <TableCell
                      className={cn(
                        "font-medium",
                        isIncome
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {amountDisplay}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category.name}</TableCell>
                    <TableCell>{transaction.account.name}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                          isIncome
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        {isIncome
                          ? t("transactions.type.income")
                          : t("transactions.type.expense")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatTransactionDateAsIs(transaction.transactionDate)}
                    </TableCell>
                    <TableCell className="text-center">
                      <TransactionsRowActions
                        transaction={transaction}
                        categoryType={transaction.category.categoryType}
                        basePath={
                          isIncome
                            ? "/dashboard/transactions/income"
                            : "/dashboard/transactions/expenses"
                        }
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
        itemCount={transactions.length}
        entity={t("transactions.title").toLowerCase()}
        disabled={isPending}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
