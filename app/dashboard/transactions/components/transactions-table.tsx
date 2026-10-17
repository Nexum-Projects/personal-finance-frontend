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
import { TransactionsRowActions } from "./transactions-row-actions"
import { TransactionsFilters } from "@/components/filters/transactions-filters"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"
import { TablePagination } from "@/components/display/table-pagination"
import { useTableSearchParams } from "@/hooks/use-table-search-params"

type SortField = "amountCents" | "transactionDate" | "createdAt" | "updatedAt"

interface TransactionsTableProps {
  transactions: Transaction[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
  categoryType: "INCOME" | "EXPENSE"
  basePath: string
  categories?: Category[]
  accounts?: Account[]
}

export function TransactionsTable({
  transactions,
  meta,
  categoryType,
  basePath,
  categories = [],
  accounts = [],
}: Readonly<TransactionsTableProps>) {
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
            placeholder={t("transactions.search.byDescription")}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <TransactionsFilters categories={categories} accounts={accounts} />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("amountCents")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("transactions.table.amount")}
                  {getSortIcon("amountCents")}
                </Button>
              </TableHead>
              <TableHead>{t("transactions.table.description")}</TableHead>
              <TableHead>{t("transactions.table.category")}</TableHead>
              <TableHead>{t("transactions.table.account")}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("transactionDate")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("transactions.table.transactionDate")}
                  {getSortIcon("transactionDate")}
                </Button>
              </TableHead>
              <TableHead className="w-16 text-center">
                {t("transactions.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("transactions.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatAmount(transaction.amountCents, preferredCurrency)}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category.name}</TableCell>
                  <TableCell>{transaction.account.name}</TableCell>
                  <TableCell>
                    {formatTransactionDateAsIs(transaction.transactionDate)}
                  </TableCell>
                  <TableCell className="text-center">
                    <TransactionsRowActions
                      transaction={transaction}
                      categoryType={categoryType}
                      basePath={basePath}
                    />
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
        itemCount={transactions.length}
        entity={t("transactions.title").toLowerCase()}
        disabled={isPending}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
