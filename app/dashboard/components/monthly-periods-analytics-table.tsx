"use client"

import { useState, useTransition } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatAmount } from "@/utils/helpers/format-amount"
import { formatPeriod } from "@/utils/helpers/humanize-month"
import { cn } from "@/lib/utils"
import type { MonthlyPeriodAnalytics } from "@/app/actions/monthly-periods/analytics"
import {
  getMonthlyBudgetsAnalyticsByMonthlyPeriod,
  type MonthlyBudgetAnalyticsByPeriodItem,
} from "@/app/actions/monthly-budgets/analytics"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ChevronDown, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Props = {
  data: MonthlyPeriodAnalytics[]
  currentYear: number
  onYearChange: (year: number) => void
  availableYears: number[]
}

export function MonthlyPeriodsAnalyticsTable({
  data,
  currentYear,
  onYearChange,
  availableYears,
}: Props) {
  // Ordenar los datos por mes (de menor a mayor) para mostrar de izquierda a derecha
  const sortedData = [...data]
    .filter((item) => item.year === currentYear) // Filtrar por año seleccionado
    .sort((a, b) => a.month - b.month)

  const formatCellValue = (cents: number, currency: string = "GT") => {
    const isNegative = cents < 0
    const formatted = formatAmount(Math.abs(cents), currency)
    return {
      value: isNegative ? `-${formatted}` : formatted,
      isNegative,
    }
  }

  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<{
    id: string
    label: string
  } | null>(null)
  const [budgets, setBudgets] = useState<MonthlyBudgetAnalyticsByPeriodItem[]>([])
  const [budgetsError, setBudgetsError] = useState<string | null>(null)

  const openBudgetsDialog = (monthlyPeriodId: string, label: string) => {
    setSelectedPeriod({ id: monthlyPeriodId, label })
    setBudgets([])
    setBudgetsError(null)
    setIsDialogOpen(true)

    startTransition(async () => {
      const result = await getMonthlyBudgetsAnalyticsByMonthlyPeriod(monthlyPeriodId)
      if (result.status === "error") {
        setBudgetsError(result.errors[0]?.message || "Error al cargar presupuestos")
        return
      }
      setBudgets(result.data.data)
    })
  }

  const rows = [
    {
      label: "Ahorro Inicial",
      getValue: (item: MonthlyPeriodAnalytics) => item.initialSavingCents,
      isBalance: false,
      description: undefined,
    },
    {
      label: "Ingresos",
      getValue: (item: MonthlyPeriodAnalytics) => item.incomeCents,
      isBalance: false,
      description: undefined,
    },
    {
      label: "Gastos",
      getValue: (item: MonthlyPeriodAnalytics) => item.expensesCents,
      isBalance: false,
      description: undefined,
    },
    {
      label: "Balance",
      getValue: (item: MonthlyPeriodAnalytics) => item.balanceCents,
      isBalance: true, // Solo esta fila muestra verde cuando es positivo
      description: "Ingresos - Gastos - Ahorro inicial",
    },
    {
      label: "Ahorro final",
      getValue: (item: MonthlyPeriodAnalytics) => item.finalSavingCents,
      isBalance: false,
      description: "Balance + Ahorro inicial",
    },
    {
      label: "Ahorro acumulado",
      getValue: (item: MonthlyPeriodAnalytics) => item.accumulatedSavingCents,
      isBalance: false,
      description: "Ahorro final + Ahorro acumulado del período anterior",
    },
  ]

  // Generar lista de años (últimos 20 años y próximos 10 años desde el año actual)
  const currentDate = new Date()
  const currentYearValue = currentDate.getFullYear()
  const allYears: number[] = []
  for (let i = currentYearValue - 20; i <= currentYearValue + 10; i++) {
    allYears.push(i)
  }
  // Ordenar de mayor a menor
  allYears.sort((a, b) => b - a)

  return (
    <div className="space-y-4">
      {/* Filtro de año */}
      <div className="flex items-center gap-4">
        <Label htmlFor="year-filter" className="text-sm font-medium">
          Año
        </Label>
        <Select
          value={currentYear.toString()}
          onValueChange={(value) => onYearChange(parseInt(value, 10))}
        >
          <SelectTrigger
            id="year-filter"
            className="w-40 h-10 font-semibold"
          >
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Seleccionar año" />
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {allYears.map((year) => (
              <SelectItem
                key={year}
                value={year.toString()}
                className="font-medium"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      {sortedData.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          No hay datos disponibles para el año {currentYear}
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 min-w-[150px]">
                  Concepto
                </TableHead>
                {sortedData.map((item) => (
                  <TableHead key={item.monthlyPeriodId} className="min-w-[160px] text-center">
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-md px-2 py-1 font-semibold hover:bg-accent hover:text-accent-foreground transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      )}
                      onClick={() =>
                        openBudgetsDialog(
                          item.monthlyPeriodId,
                          formatPeriod(item.year, item.month)
                        )
                      }
                      title="Ver presupuestos por categoría"
                    >
                      {formatPeriod(item.year, item.month)}
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="sticky left-0 bg-background z-10 font-medium">
                    <div className="flex flex-col">
                      <span>{row.label}</span>
                      {row.description && (
                        <span className="text-xs text-muted-foreground font-normal mt-0.5">
                          {row.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  {sortedData.map((item) => {
                    const cents = row.getValue(item)
                    const { value, isNegative } = formatCellValue(cents)
                    const isBalance = row.isBalance === true

                    return (
                      <TableCell
                        key={item.monthlyPeriodId}
                        className={cn(
                          "text-center",
                          isNegative
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : isBalance
                              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "" // Color blanco normal para valores positivos en otras filas
                        )}
                      >
                        {value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Presupuestos por categoría {selectedPeriod ? `- ${selectedPeriod.label}` : ""}
            </DialogTitle>
            <DialogDescription>
              Presupuesto, gastado y restante por categoría para el período mensual seleccionado.
            </DialogDescription>
          </DialogHeader>

          {budgetsError ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {budgetsError}
            </div>
          ) : null}

          <div className="rounded-md border">
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Presupuesto</TableHead>
                    <TableHead className="text-right">Gastado</TableHead>
                    <TableHead className="text-right">Restante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isPending ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : budgets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        No hay presupuestos para este período
                      </TableCell>
                    </TableRow>
                  ) : (
                    budgets.map((b) => {
                      const remainingIsNegative = b.remainingCents < 0
                      return (
                        <TableRow key={b.monthlyBudgetId}>
                          <TableCell className="font-medium">{b.categoryName}</TableCell>
                          <TableCell className="text-right">
                            {formatAmount(b.budgetedCents, "GT")}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatAmount(b.spentCents, "GT")}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-semibold",
                              remainingIsNegative
                                ? "text-red-600 dark:text-red-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            )}
                          >
                            {formatAmount(b.remainingCents, "GT")}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

