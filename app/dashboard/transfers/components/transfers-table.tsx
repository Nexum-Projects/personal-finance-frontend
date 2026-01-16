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
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"

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
  const { preferredCurrency, timeZoneIana } = useUserPreferences()
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

  return (
    <div className="space-y-4">
      {/* Search Bar and Filters */}
      <div className="flex items-center gap-4">
        <div className="w-1/4">
          <Input
            placeholder="Buscar transferencias..."
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
                  Fecha
                  {getSortIcon("transferDate")}
                </Button>
              </TableHead>
              <TableHead>Cuenta Origen</TableHead>
              <TableHead>Cuenta Destino</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("amountCents")}
                  className="h-8 px-2 lg:px-3"
                >
                  Monto
                  {getSortIcon("amountCents")}
                </Button>
              </TableHead>
              <TableHead>Descripción</TableHead>
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
            {transfers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron transferencias
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
                  <TableCell>{formatDate(transfer.updatedAt)}</TableCell>
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
          Mostrando {transfers.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0} a{" "}
          {Math.min(currentPage * meta.limit, meta.totalObjects)} de{" "}
          {meta.totalObjects} transferencias
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

