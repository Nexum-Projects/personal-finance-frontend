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
import type { Account } from "@/app/actions/transactions/types"
import { AccountsRowActions } from "./accounts-row-actions"
import { AccountsExportAction } from "./accounts-export-action"
import { formatAmount } from "@/utils/helpers/format-amount"
import { humanizeAccountType } from "@/utils/helpers/humanize-account-type"
import { AccountsFilters } from "@/components/filters/accounts-filters"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"
import { TablePagination } from "@/components/display/table-pagination"
import { useTableSearchParams } from "@/hooks/use-table-search-params"
import { formatDateTime } from "@/utils/helpers/format-date-time"

type SortField = "name" | "accountType" | "currentBalanceCents" | "updatedAt"

interface AccountsTableProps {
  accounts: Account[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function AccountsTable({
  accounts,
  meta,
}: Readonly<AccountsTableProps>) {
  const { preferredCurrency, timeZoneIana, preferredLanguage, locale } =
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
  } = useTableSearchParams<SortField>("/dashboard/accounts")

  return (
    <div className="space-y-4">
      {/* Search Bar and Filters */}
      <div className="flex items-center gap-4">
        <div className="w-1/4">
          <Input
            placeholder={t("accounts.searchPlaceholder")}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <AccountsFilters />
        <AccountsExportAction />
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
                  {t("accounts.table.name")}
                  {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("accountType")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("accounts.table.type")}
                  {getSortIcon("accountType")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("currentBalanceCents")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("accounts.table.balance")}
                  {getSortIcon("currentBalanceCents")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("updatedAt")}
                  className="h-8 px-2 lg:px-3"
                >
                  {t("accounts.table.updatedAt")}
                  {getSortIcon("updatedAt")}
                </Button>
              </TableHead>
              <TableHead className="w-16 text-center">
                {t("accounts.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("accounts.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>
                    {humanizeAccountType(
                      account.accountType,
                      preferredLanguage
                    )}
                  </TableCell>
                  <TableCell>
                    {formatAmount(
                      account.currentBalanceCents,
                      preferredCurrency
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(account.updatedAt, locale, timeZoneIana)}
                  </TableCell>
                  <TableCell className="text-center">
                    <AccountsRowActions account={account} />
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
        itemCount={accounts.length}
        entity={t("accounts.title").toLowerCase()}
        disabled={isPending}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
