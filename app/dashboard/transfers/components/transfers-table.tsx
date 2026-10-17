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
import type { Transfer } from "@/app/actions/transfers"
import { TransfersRowActions } from "./transfers-row-actions"
import { formatAmount } from "@/utils/helpers/format-amount"
import { formatDateOnlyShort } from "@/utils/helpers/format-date-only"
import { TransfersFilters } from "@/components/filters/transfers-filters"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"
import { TablePagination } from "@/components/display/table-pagination"
import { useTableSearchParams } from "@/hooks/use-table-search-params"
import { formatDateTime } from "@/utils/helpers/format-date-time"

type SortField = "transferDate" | "amountCents" | "updatedAt"

interface TransfersTableProps {
  transfers: Transfer[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function TransfersTable({
  transfers,
  meta,
}: Readonly<TransfersTableProps>) {
  const { preferredCurrency, timeZoneIana, locale } = useUserPreferences()
  const { t } = useI18n()
  const {
    isPending,
    currentPage,
    search,
    handleSearch,
    handleSort,
    handlePageChange,
    getSortIcon,
  } = useTableSearchParams<SortField>("/dashboard/transfers")

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
                  <TableCell>
                    {formatDateOnlyShort(transfer.transferDate, timeZoneIana)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transfer.fromAccount.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transfer.toAccount.name}
                  </TableCell>
                  <TableCell>
                    {formatAmount(transfer.amountCents, preferredCurrency)}
                  </TableCell>
                  <TableCell>{transfer.description}</TableCell>
                  <TableCell>
                    {formatDateTime(transfer.updatedAt, locale, timeZoneIana)}
                  </TableCell>
                  <TableCell className="text-center">
                    <TransfersRowActions transfer={transfer} />
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
        itemCount={transfers.length}
        entity={t("transfers.title").toLowerCase()}
        disabled={isPending}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
