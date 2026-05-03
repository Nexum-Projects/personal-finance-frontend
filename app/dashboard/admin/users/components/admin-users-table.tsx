"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
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
import type { AdminUsersOrderBy, User, UserRole } from "@/app/actions/users/types"
import { humanizeRole } from "@/utils/helpers/humanize-role"
import { cn } from "@/lib/utils"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"
import { AdminUsersRowActions } from "./admin-users-row-actions"

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

export function AdminUsersTable({ users, meta }: AdminUsersTableProps) {
  const { timeZoneIana, locale } = useUserPreferences()
  const { t, language } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const currentSearch = searchParams.get("search") || ""
  const currentOrderBy = (searchParams.get("orderBy") || "") as SortField | ""
  const currentOrder = (searchParams.get("order") || "ASC").toUpperCase() as "ASC" | "DESC"
  const currentLimit = parseInt(searchParams.get("limit") || String(meta.limit), 10) || meta.limit

  const [search, setSearch] = useState(currentSearch)

  const formatDateTime = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(locale, {
        timeZone: timeZoneIana,
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(iso))
    } catch {
      return iso
    }
  }

  const renderEmailVerified = (user: User) => {
    const raw = user.emailVerifiedAt
    if (raw == null || raw === "") {
      return (
        <span className="text-muted-foreground">{t("admin.users.emailNotVerified")}</span>
      )
    }
    return (
      <span className="text-muted-foreground text-sm tabular-nums">{formatDateTime(raw)}</span>
    )
  }

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    if (
      updates.search !== undefined ||
      updates.orderBy !== undefined ||
      updates.order !== undefined ||
      updates.limit !== undefined
    ) {
      params.set("page", "1")
    }

    startTransition(() => {
      router.push(`${BASE_PATH}?${params.toString()}`)
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

  const handleLimitChange = (value: string) => {
    updateSearchParams({ limit: value })
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
          <span className="text-sm text-muted-foreground whitespace-nowrap">
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
              <TableHead className="text-right w-[140px]">{t("admin.users.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  {t("admin.users.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{renderEmailVerified(user)}</TableCell>
                  <TableCell>{humanizeRole(safeRole(user.role), language)}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        user.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {user.isActive ? "✓" : "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm tabular-nums">
                    {formatDateTime(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm tabular-nums">
                    {formatDateTime(user.updatedAt)}
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {t("pagination.showing", {
            from: users.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0,
            to: Math.min(currentPage * meta.limit, meta.totalObjects),
            total: meta.totalObjects,
            entity: t("admin.users.entity"),
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isPending}
          >
            {t("pagination.prev")}
          </Button>
          <div className="flex flex-wrap items-center gap-1">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                disabled={isPending}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= meta.totalPages || isPending || meta.totalPages === 0}
          >
            {t("pagination.next")}
          </Button>
        </div>
      </div>
    </div>
  )
}
