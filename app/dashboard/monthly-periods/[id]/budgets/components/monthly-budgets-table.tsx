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
import { formatAmount, centsToDecimal } from "@/utils/helpers/format-amount"
import type { MonthlyBudget } from "@/app/actions/monthly-budgets/types"
import { MonthlyBudgetsRowActions } from "./monthly-budgets-row-actions"
import { humanizeCategoryType } from "@/utils/helpers/humanize-category-type"

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

type SortField = "budgetedCents" | "updatedAt"
type SortDirection = "ASC" | "DESC"

interface MonthlyBudgetsTableProps {
  monthlyPeriodId: string
  budgets: MonthlyBudget[]
  meta: {
    page: number
    limit: number
    totalObjects: number
    totalPages: number
  }
}

export function MonthlyBudgetsTable({
  monthlyPeriodId,
  budgets,
  meta,
}: MonthlyBudgetsTableProps) {
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
      router.push(`/dashboard/monthly-periods/${monthlyPeriodId}/budgets?${params.toString()}`)
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
      {/* Search Bar - 1/4 del ancho de la tabla */}
      <div className="flex items-center gap-4">
        <div className="w-1/4">
          <Input
            placeholder="Buscar presupuestos..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoría</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("budgetedCents")}
                  className="h-8 px-2 lg:px-3"
                >
                  Presupuestado
                  {getSortIcon("budgetedCents")}
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
            {budgets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron presupuestos
                </TableCell>
              </TableRow>
            ) : (
              budgets.map((budget) => {
                const currency = "GT" // Asumimos GTQ por defecto, ajustar según necesidad
                return (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.category.name}</TableCell>
                    <TableCell>{humanizeCategoryType(budget.category.categoryType)}</TableCell>
                    <TableCell>
                      {formatAmount(budget.budgetedCents, currency)}
                    </TableCell>
                    <TableCell>
                      {budget.isActive ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Activo
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">
                          Inactivo
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(budget.updatedAt)}</TableCell>
                    <TableCell className="text-center">
                      <MonthlyBudgetsRowActions
                        monthlyPeriodId={monthlyPeriodId}
                        budget={budget}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {budgets.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0} a{" "}
          {Math.min(currentPage * meta.limit, meta.totalObjects)} de{" "}
          {meta.totalObjects} presupuestos
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

