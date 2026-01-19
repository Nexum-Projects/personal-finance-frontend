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
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
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
import { useI18n } from "@/components/i18n/i18n-provider"

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
  const { preferredCurrency, locale } = useUserPreferences()
  const { t } = useI18n()
  // Ordenar los datos por mes (de menor a mayor) para mostrar de izquierda a derecha
  const sortedData = [...data]
    .filter((item) => item.year === currentYear) // Filtrar por año seleccionado
    .sort((a, b) => a.month - b.month)

  const formatCellValue = (cents: number) => {
    const isNegative = cents < 0
    const formatted = formatAmount(Math.abs(cents), preferredCurrency)
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
      label: t("dashboard.monthlyAnalytics.rows.initialSaving"),
      getValue: (item: MonthlyPeriodAnalytics) => item.initialSavingCents,
      isBalance: false,
      description: undefined,
    },
    {
      label: t("dashboard.monthlyAnalytics.rows.income"),
      getValue: (item: MonthlyPeriodAnalytics) => item.incomeCents,
      isBalance: false,
      description: undefined,
    },
    {
      label: t("dashboard.monthlyAnalytics.rows.expenses"),
      getValue: (item: MonthlyPeriodAnalytics) => item.expensesCents,
      isBalance: false,
      description: undefined,
    },
    {
      label: t("dashboard.monthlyAnalytics.rows.balance"),
      getValue: (item: MonthlyPeriodAnalytics) => item.balanceCents,
      isBalance: true, // Solo esta fila muestra verde cuando es positivo
      description: t("dashboard.monthlyAnalytics.rows.balance.desc"),
    },
    {
      label: t("dashboard.monthlyAnalytics.rows.finalSaving"),
      getValue: (item: MonthlyPeriodAnalytics) => item.finalSavingCents,
      isBalance: false,
      description: t("dashboard.monthlyAnalytics.rows.finalSaving.desc"),
    },
    {
      label: t("dashboard.monthlyAnalytics.rows.accumulatedSaving"),
      getValue: (item: MonthlyPeriodAnalytics) => item.accumulatedSavingCents,
      isBalance: false,
      description: t("dashboard.monthlyAnalytics.rows.accumulatedSaving.desc"),
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
          {t("common.year")}
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
            <SelectValue placeholder={t("common.selectYear")} />
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
          {t("dashboard.monthlyAnalytics.emptyForYear", { year: currentYear })}
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 min-w-[150px]">
                  {t("common.concept")}
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
                          formatPeriod(item.year, item.month, locale)
                        )
                      }
                      title={t("dashboard.monthlyAnalytics.viewBudgetsTooltip")}
                    >
                      {formatPeriod(item.year, item.month, locale)}
                    </button>
                  </TableHead>
                ))}
                <TableHead className="min-w-[160px] text-center font-semibold">
                  {t("common.total")}
                </TableHead>
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

                  {(() => {
                    const totalCents = sortedData.reduce((acc, item) => acc + row.getValue(item), 0)
                    const { value, isNegative } = formatCellValue(totalCents)
                    const isBalance = row.isBalance === true

                    return (
                      <TableCell
                        className={cn(
                          "text-center font-semibold",
                          isNegative
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : isBalance
                              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : ""
                        )}
                      >
                        {value}
                      </TableCell>
                    )
                  })()}
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
              {t("dashboard.monthlyAnalytics.dialog.title", {
                period: selectedPeriod ? `- ${selectedPeriod.label}` : "",
              })}
            </DialogTitle>
            <DialogDescription>
              {t("dashboard.monthlyAnalytics.dialog.subtitle")}
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
                    <TableHead>{t("common.category")}</TableHead>
                    <TableHead className="text-right">{t("common.budgeted")}</TableHead>
                    <TableHead className="text-right">{t("common.spent")}</TableHead>
                    <TableHead className="text-right">{t("common.remaining")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isPending ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        {t("common.loading")}
                      </TableCell>
                    </TableRow>
                  ) : budgets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        {t("dashboard.monthlyAnalytics.dialog.empty")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    budgets.map((b) => {
                      const remainingIsNegative = b.remainingCents < 0
                      return (
                        <TableRow key={b.monthlyBudgetId}>
                          <TableCell className="font-medium">{b.categoryName}</TableCell>
                          <TableCell className="text-right">
                            {formatAmount(b.budgetedCents, preferredCurrency)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatAmount(b.spentCents, preferredCurrency)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-semibold",
                              remainingIsNegative
                                ? "text-red-600 dark:text-red-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            )}
                          >
                            {formatAmount(b.remainingCents, preferredCurrency)}
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
              {t("common.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

