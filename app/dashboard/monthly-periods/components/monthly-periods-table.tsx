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
import type { MonthlyPeriod } from "@/app/actions/monthly-periods/types"
import { MonthlyPeriodsRowActions } from "./monthly-periods-row-actions"
import { humanizeMonth } from "@/utils/helpers/humanize-month"
import { MonthlyPeriodsFilters } from "@/components/filters/monthly-periods-filters"

// Formateo de fecha simple sin dependencias externas
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${day}/${month}/${year} ${hours}:${minutes}`
  } catch {
    return dateString
  }
}

type SortField = "year" | "month" | "updatedAt"
type SortDirection = "ASC" | "DESC"

interface MonthlyPeriodsTableProps {
  monthlyPeriods: MonthlyPeriod[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function MonthlyPeriodsTable({ monthlyPeriods, meta }: MonthlyPeriodsTableProps) {
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

    // Reset to page 1 when search, sort, or filters change
    if (updates.search !== undefined || updates.orderBy !== undefined || updates.order !== undefined || updates.startDate !== undefined || updates.endDate !== undefined) {
      params.set("page", "1")
    }

    startTransition(() => {
      router.push(`/dashboard/monthly-periods?${params.toString()}`)
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
            placeholder="Buscar presupuestos mensuales..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <MonthlyPeriodsFilters />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("year")}
                  className="h-8 px-2 lg:px-3"
                >
                  Año
                  {getSortIcon("year")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("month")}
                  className="h-8 px-2 lg:px-3"
                >
                  Mes
                  {getSortIcon("month")}
                </Button>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("updatedAt")}
                  className="h-8 px-2 lg:px-3"
                >
                  Última Actualización
                  {getSortIcon("updatedAt")}
                </Button>
              </TableHead>
              <TableHead className="w-16 text-center">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyPeriods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron presupuestos mensuales
                </TableCell>
              </TableRow>
            ) : (
              monthlyPeriods.map((period) => (
                <TableRow key={period.id}>
                  <TableCell className="font-medium">{period.year}</TableCell>
                  <TableCell>{humanizeMonth(period.month)}</TableCell>
                  <TableCell>
                    {period.isActive ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Activo
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">
                        Inactivo
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(period.updatedAt)}</TableCell>
                  <TableCell className="text-center">
                    <MonthlyPeriodsRowActions monthlyPeriod={period} />
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
          Mostrando {monthlyPeriods.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0} a{" "}
          {Math.min(currentPage * meta.limit, meta.totalObjects)} de{" "}
          {meta.totalObjects} presupuestos mensuales
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isPending}
          >
            Anterior
          </Button>
          <div className="text-sm text-foreground">
            Página {currentPage} de {meta.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= meta.totalPages || isPending}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}

