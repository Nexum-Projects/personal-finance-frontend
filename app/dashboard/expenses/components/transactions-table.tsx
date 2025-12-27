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
import type { Transaction } from "@/app/actions/transactions/types"
import { TransactionsRowActions } from "./transactions-row-actions"

// Formateo de fecha simple
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return dateString
  }
}

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
}

export function TransactionsTable({ 
  transactions, 
  meta, 
  categoryType,
  basePath 
}: TransactionsTableProps) {
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
      {/* Search Bar - 1/4 del ancho de la tabla */}
      <div className="flex items-center gap-4">
        <div className="w-1/4">
          <Input
            placeholder="Buscar transacciones..."
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
              <TableHead>Categoría</TableHead>
              <TableHead>Cuenta</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("transactionDate")}
                  className="h-8 px-2 lg:px-3"
                >
                  Fecha de Transacción
                  {getSortIcon("transactionDate")}
                </Button>
              </TableHead>
              <TableHead className="w-16 text-center">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron transacciones
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatAmount(transaction.amountCents, transaction.account.currency)}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category.name}</TableCell>
                  <TableCell>{transaction.account.name}</TableCell>
                  <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
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
          Mostrando {transactions.length > 0 ? (currentPage - 1) * meta.limit + 1 : 0} a{" "}
          {Math.min(currentPage * meta.limit, meta.totalObjects)} de{" "}
          {meta.totalObjects} transacciones
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

