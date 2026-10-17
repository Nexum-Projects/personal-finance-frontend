"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  AdminUsersOrderBy,
  User,
  UserRole,
} from "@/app/actions/users/types"
import { humanizeRole } from "@/utils/helpers/humanize-role"
import { cn } from "@/lib/utils"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"
import { TablePagination } from "@/components/display/table-pagination"
import { useTableSearchParams } from "@/hooks/use-table-search-params"
import { AdminUsersRowActions } from "./admin-users-row-actions"
import { formatDateTime } from "@/utils/helpers/format-date-time"

const BASE_PATH = "/dashboard/admin/users"

type SortField = AdminUsersOrderBy

interface AdminUsersTableProps {
  users: User[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function AdminUsersTable({
  users,
  meta,
}: Readonly<AdminUsersTableProps>) {
  const { timeZoneIana, locale } = useUserPreferences()
  const { t, language } = useI18n()
  const {
    searchParams,
    isPending,
    currentPage,
    search,
    updateSearchParams,
    handleSearch,
    handleSort,
    handlePageChange,
    getSortIcon,
  } = useTableSearchParams<SortField>(BASE_PATH, {
    defaultOrderBy: "",
    defaultOrder: "ASC",
  })

  const currentLimit =
    Number.parseInt(searchParams.get("limit") || String(meta.limit), 10) ||
    meta.limit

  const renderEmailVerified = (user: User) => {
    const raw = user.emailVerifiedAt
    if (raw == null || raw === "") {
      return (
        <span className="text-muted-foreground">
          {t("admin.users.emailNotVerified")}
        </span>
      )
    }
    return (
      <span className="text-sm tabular-nums text-muted-foreground">
        {formatDateTime(raw, locale, timeZoneIana)}
      </span>
    )
  }

  const handleLimitChange = (value: string) => {
    updateSearchParams({ limit: value })
  }

  const safeRole = (role: string): UserRole =>
    role === "USER" || role === "ADMIN" || role === "SYSADMIN" ? role : "USER"

  const limitChoices = useMemo(() => {
    const base = [10, 25, 50, 100]
    if (!base.includes(currentLimit)) {
      return [...base, currentLimit].sort((a, b) => a - b)
    }
    return base
  }, [currentLimit])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <Input
            placeholder={t("admin.users.search")}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {t("admin.users.limit")}
          </span>
          <Select
            value={String(currentLimit)}
            onValueChange={handleLimitChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {limitChoices.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("username")}
                >
                  {t("admin.users.table.username")}
                  {getSortIcon("username")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("email")}
                >
                  {t("admin.users.table.email")}
                  {getSortIcon("email")}
                </Button>
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("admin.users.table.emailVerified")}
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("role")}
                >
                  {t("admin.users.table.role")}
                  {getSortIcon("role")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("isActive")}
                >
                  {t("admin.users.table.active")}
                  {getSortIcon("isActive")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("createdAt")}
                >
                  {t("admin.users.table.createdAt")}
                  {getSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("updatedAt")}
                >
                  {t("admin.users.table.updatedAt")}
                  {getSortIcon("updatedAt")}
                </Button>
              </TableHead>
              <TableHead className="w-[140px] text-right">
                {t("admin.users.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t("admin.users.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{renderEmailVerified(user)}</TableCell>
                  <TableCell>
                    {humanizeRole(safeRole(user.role), language)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        user.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {user.isActive ? "✓" : "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm tabular-nums text-muted-foreground">
                    {formatDateTime(user.createdAt, locale, timeZoneIana)}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums text-muted-foreground">
                    {formatDateTime(user.updatedAt, locale, timeZoneIana)}
                  </TableCell>
                  <TableCell className="text-right align-middle">
                    <AdminUsersRowActions user={user} />
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
        itemCount={users.length}
        entity={t("admin.users.entity")}
        disabled={isPending}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
