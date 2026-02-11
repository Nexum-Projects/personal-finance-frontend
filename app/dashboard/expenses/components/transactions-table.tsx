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
import { formatAmount } from "@/utils/helpers/format-amount"
import { formatTransactionDateAsIs } from "@/utils/helpers/format-date-only"
import type { Transaction, Category, Account } from "@/app/actions/transactions/types"
import { TransactionsRowActions } from "./transactions-row-actions"
import { TransactionsFilters } from "@/components/filters/transactions-filters"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"

type SortField = "amountCents" | "transactionDate" | "createdAt" | "updatedAt"
type SortDirection = "ASC" | "DESC"

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
}: TransactionsTableProps) {
  const { preferredCurrency, timeZoneIana, locale } = useUserPreferences()
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

    // Reset to page 1 when search or sort changes
    if (updates.search !== undefined || updates.orderBy !== undefined || updates.order !== undefined) {
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
                  <TableCell>{formatTransactionDateAsIs(transaction.transactionDate)}</TableCell>
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("pagination.showing", {
            from: transactions.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0,
            to: Math.min(currentPage * meta.limit, meta.totalObjects),
            total: meta.totalObjects,
            entity: t("transactions.title").toLowerCase(),
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

