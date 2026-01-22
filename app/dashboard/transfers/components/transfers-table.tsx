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
import type { Transfer } from "@/app/actions/transfers"
import { TransfersRowActions } from "./transfers-row-actions"
import { formatAmount } from "@/utils/helpers/format-amount"
import { formatDateOnlyShort } from "@/utils/helpers/format-date-only"
import { TransfersFilters } from "@/components/filters/transfers-filters"
import { TransfersExportAction } from "./transfers-export-action"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"

type SortField = "transferDate" | "amountCents" | "updatedAt"
type SortDirection = "ASC" | "DESC"

interface TransfersTableProps {
  transfers: Transfer[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function TransfersTable({ transfers, meta }: TransfersTableProps) {
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
      router.push(`/dashboard/transfers?${params.toString()}`)
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
            placeholder={t("transfers.search.placeholder")}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <TransfersFilters />
        <TransfersExportAction />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("transferDate")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("transfers.table.date")}
                  {getSortIcon("transferDate")}
                </Button>
              </TableHead>
              <TableHead>{t("transfers.table.fromAccount")}</TableHead>
              <TableHead>{t("transfers.table.toAccount")}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("amountCents")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("transfers.table.amount")}
                  {getSortIcon("amountCents")}
                </Button>
              </TableHead>
              <TableHead>{t("transfers.table.description")}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("updatedAt")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("transfers.table.updatedAt")}
                  {getSortIcon("updatedAt")}
                </Button>
              </TableHead>
              <TableHead className="w-16 text-center">
                {t("transfers.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("transfers.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{formatDateOnlyShort(transfer.transferDate, timeZoneIana)}</TableCell>
                  <TableCell className="font-medium">{transfer.fromAccount.name}</TableCell>
                  <TableCell className="font-medium">{transfer.toAccount.name}</TableCell>
                  <TableCell>
                    {formatAmount(transfer.amountCents, preferredCurrency)}
                  </TableCell>
                  <TableCell>{transfer.description}</TableCell>
                  <TableCell>{formatDateTime(transfer.updatedAt)}</TableCell>
                  <TableCell className="text-center">
                    <TransfersRowActions transfer={transfer} />
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
            from: transfers.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0,
            to: Math.min(currentPage * meta.limit, meta.totalObjects),
            total: meta.totalObjects,
            entity: t("transfers.title").toLowerCase(),
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

