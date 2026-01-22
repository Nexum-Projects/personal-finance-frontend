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
import type { Transaction, Category, Account } from "@/app/actions/transactions/types"
import { TransactionsRowActions } from "../../expenses/components/transactions-row-actions"
import { TransactionsFilters } from "@/components/filters/transactions-filters"
import { TransactionsExportAction } from "./transactions-export-action"
import { cn } from "@/lib/utils"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"

type SortField = "amountCents" | "transactionDate" | "createdAt" | "updatedAt"
type SortDirection = "ASC" | "DESC"

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
}: AllTransactionsTableProps) {
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

  const formatDateShort = (dateString: string): string => {
    try {
      const d = new Date(dateString)
      return new Intl.DateTimeFormat(locale, {
        timeZone: timeZoneIana,
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
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
              <TableHead className="text-center">{t("transactions.table.actions")}</TableHead>
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
                    <TableCell className={cn(
                      "font-medium",
                      isIncome ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {amountDisplay}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category.name}</TableCell>
                    <TableCell>{transaction.account.name}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        isIncome 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {isIncome ? t("transactions.type.income") : t("transactions.type.expense")}
                      </span>
                    </TableCell>
                    <TableCell>{formatDateShort(transaction.transactionDate)}</TableCell>
                    <TableCell className="text-center">
                      <TransactionsRowActions 
                        transaction={transaction} 
                        categoryType={transaction.category.categoryType}
                        basePath={isIncome ? "/dashboard/transactions/income" : "/dashboard/transactions/expenses"}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("pagination.showing", {
            from: transactions.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0,
            to: Math.min(currentPage * meta.limit, meta.totalObjects),
            total: meta.totalObjects,
            entity: t("transactions.title").toLowerCase(),
          })}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isPending}
          >
            {t("pagination.prev")}
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  disabled={isPending}
                >
                  {page}
                </Button>
              )
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === meta.totalPages || isPending}
          >
            {t("pagination.next")}
          </Button>
        </div>
      </div>
    </div>
  )
}

