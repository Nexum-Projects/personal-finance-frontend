"use client"

import { useState, useEffect, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DateRangePicker } from "./date-range-picker"
import { TrendsChart } from "./trends-chart"
import { CategoryPieChart } from "./pie-chart"
import { AccountBalancePieChart } from "./account-balance-pie-chart"
import { MonthlyPeriodsAnalyticsTable } from "./monthly-periods-analytics-table"
import {
  getAnalyticsSummary,
  getExpenseCategoryBreakdown,
  getIncomeCategoryBreakdown,
  getTrends,
  getAccountBalanceBreakdown,
  type AnalyticsSummary,
  type CategoryBreakdown,
  type TrendData,
  type AccountBalanceBreakdown,
} from "@/app/actions/analytics"
import { getMonthlyPeriodsAnalytics, type MonthlyPeriodAnalytics } from "@/app/actions/monthly-periods/analytics"
import { formatAmount } from "@/utils/helpers/format-amount"
import { toast } from "sonner"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"

interface DashboardContentProps {
  initialSummary: AnalyticsSummary | null
  initialExpenseCategories: CategoryBreakdown[]
  initialIncomeCategories: CategoryBreakdown[]
  initialTrends: TrendData[]
  initialTotalAccounts: number
  initialAccountBalanceBreakdown: AccountBalanceBreakdown[]
  initialMonthlyPeriodsAnalytics: MonthlyPeriodAnalytics[]
  initialAnalyticsYear: number
  availableYears: number[]
}

export function DashboardContent({
  initialSummary,
  initialExpenseCategories,
  initialIncomeCategories,
  initialTrends,
  initialTotalAccounts,
  initialAccountBalanceBreakdown,
  initialMonthlyPeriodsAnalytics,
  initialAnalyticsYear,
  availableYears,
}: DashboardContentProps) {
  const { preferredCurrency, timeZoneIana } = useUserPreferences()
  const [isPending, startTransition] = useTransition()
  const [summary, setSummary] = useState<AnalyticsSummary | null>(initialSummary)
  const [expenseCategories, setExpenseCategories] = useState<CategoryBreakdown[]>(
    initialExpenseCategories
  )
  const [incomeCategories, setIncomeCategories] = useState<CategoryBreakdown[]>(
    initialIncomeCategories
  )
  const [trends, setTrends] = useState<TrendData[]>(initialTrends)
  const [totalAccounts, setTotalAccounts] = useState(initialTotalAccounts)
  const [accountBalanceBreakdown, setAccountBalanceBreakdown] = useState<
    AccountBalanceBreakdown[]
  >(initialAccountBalanceBreakdown)
  const [monthlyPeriodsAnalytics, setMonthlyPeriodsAnalytics] = useState<
    MonthlyPeriodAnalytics[]
  >(initialMonthlyPeriodsAnalytics)
  const [analyticsYear, setAnalyticsYear] = useState(initialAnalyticsYear)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)

  // Calcular fechas por defecto (último mes)
  const getDateInTimeZone = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZoneIana,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    return formatter.format(date)
  }

  const getDefaultDates = () => {
    const now = new Date()
    const endDate = new Date(now)
    const startDate = new Date(now)
    startDate.setMonth(startDate.getMonth() - 1)
    return {
      startDate: getDateInTimeZone(startDate),
      endDate: getDateInTimeZone(endDate),
    }
  }

  const [dateRange, setDateRange] = useState(getDefaultDates())
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month" | "year">("day")

  const loadData = () => {
    startTransition(async () => {
      try {
        const [summaryResult, expenseResult, incomeResult, trendsResult, balanceResult] =
          await Promise.all([
            getAnalyticsSummary({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            }),
            getExpenseCategoryBreakdown({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            }),
            getIncomeCategoryBreakdown({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            }),
            getTrends({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              groupBy: groupBy,
            }),
            getAccountBalanceBreakdown(),
          ])

        if (summaryResult.status === "success") {
          setSummary(summaryResult.data)
          setTotalAccounts(summaryResult.data.totalAccounts)
        } else {
          const firstError = summaryResult.errors?.[0]
          const errorMessage =
            firstError?.title || firstError?.message || "Error al cargar resumen"
          console.error("Error al cargar resumen:", JSON.stringify(summaryResult.errors, null, 2))
          toast.error(errorMessage, {
            description: firstError?.message || firstError?.title,
          })
        }

        if (expenseResult.status === "success") {
          setExpenseCategories(expenseResult.data)
        } else {
          const firstError = expenseResult.errors?.[0]
          const errorMessage =
            firstError?.title || firstError?.message || "Error al cargar categorías de gastos"
          console.error("Error al cargar categorías de gastos:", JSON.stringify(expenseResult.errors, null, 2))
          toast.error(errorMessage, {
            description: firstError?.message || firstError?.title,
          })
        }

        if (incomeResult.status === "success") {
          setIncomeCategories(incomeResult.data)
        } else {
          const firstError = incomeResult.errors?.[0]
          const errorMessage =
            firstError?.title || firstError?.message || "Error al cargar categorías de ingresos"
          console.error("Error al cargar categorías de ingresos:", JSON.stringify(incomeResult.errors, null, 2))
          toast.error(errorMessage, {
            description: firstError?.message || firstError?.title,
          })
        }

        if (trendsResult.status === "success") {
          setTrends(trendsResult.data)
        } else {
          const firstError = trendsResult.errors?.[0]
          const errorMessage =
            firstError?.title || firstError?.message || "Error al cargar tendencias"
          console.error("Error al cargar tendencias:", JSON.stringify(trendsResult.errors, null, 2))
          toast.error(errorMessage, {
            description: firstError?.message || firstError?.title,
          })
        }

        if (balanceResult.status === "success") {
          setAccountBalanceBreakdown(balanceResult.data)
        } else {
          const firstError = balanceResult.errors?.[0]
          const errorMessage =
            firstError?.title || firstError?.message || "Error al cargar balance por cuenta"
          console.error(
            "Error al cargar balance por cuenta:",
            JSON.stringify(balanceResult.errors, null, 2)
          )
          toast.error(errorMessage, {
            description: firstError?.message || firstError?.title,
          })
        }
      } catch (error) {
        console.error("Error inesperado al cargar datos del dashboard:", error)
        toast.error("Error al cargar datos del dashboard")
      }
    })
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.startDate, dateRange.endDate, groupBy])

  const handleStartDateChange = (date: string) => {
    setDateRange((prev) => ({ ...prev, startDate: date }))
  }

  const handleEndDateChange = (date: string) => {
    setDateRange((prev) => ({ ...prev, endDate: date }))
  }

  return (
    <div className="space-y-6">
      {/* Header con selector de fechas */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Vista general de tus finanzas
          </p>
        </div>
        <div className="w-full md:w-auto">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {summary ? formatAmount(summary.totalBalanceCents, preferredCurrency) : "$0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary && summary.growthPercentage !== null
                ? `${summary.growthPercentage >= 0 ? "+" : ""}${summary.growthPercentage.toFixed(1)}% desde el período anterior`
                : "Sin datos comparativos"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {summary ? formatAmount(summary.totalIncomeCents, preferredCurrency) : "$0.00"}
            </div>
            <p className="text-xs text-muted-foreground">En el rango seleccionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {summary ? formatAmount(summary.totalExpensesCents, preferredCurrency) : "$0.00"}
            </div>
            <p className="text-xs text-muted-foreground">En el rango seleccionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuentas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalAccounts}</div>
            <p className="text-xs text-muted-foreground">Cuentas activas</p>
          </CardContent>
        </Card>
      </div>

      {/* Cards adicionales */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ahorros</CardTitle>
            <CardDescription>Ingresos - Gastos</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                summary && summary.savingsCents < 0
                  ? "text-destructive"
                  : "text-success"
              }`}
            >
              {summary ? formatAmount(summary.savingsCents, preferredCurrency) : "$0.00"}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Monto neto: {summary ? formatAmount(summary.netAmountCents, preferredCurrency) : "$0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
            <CardDescription>Métricas financieras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ingresos:</span>
                <span className="font-medium text-success">
                  {summary ? formatAmount(summary.totalIncomeCents, preferredCurrency) : "$0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gastos:</span>
                <span className="font-medium text-destructive">
                  {summary ? formatAmount(summary.totalExpensesCents, preferredCurrency) : "$0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance:</span>
                <span className="font-medium">
                  {summary ? formatAmount(summary.totalBalanceCents, preferredCurrency) : "$0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Tendencias Financieras</CardTitle>
                <CardDescription>Evolución de ingresos, gastos y ahorros en el tiempo</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="groupBy" className="text-sm whitespace-nowrap">
                  Agrupar por:
                </Label>
                <Select
                  value={groupBy}
                  onValueChange={(value: "day" | "week" | "month" | "year") => setGroupBy(value)}
                >
                  <SelectTrigger id="groupBy" className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Día</SelectItem>
                    <SelectItem value="week">Semana</SelectItem>
                    <SelectItem value="month">Mes</SelectItem>
                    <SelectItem value="year">Año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                Cargando...
              </div>
            ) : trends.length === 0 ? (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                No hay datos disponibles para el rango seleccionado
              </div>
            ) : (
              <TrendsChart data={trends} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
            <CardDescription>Distribución de gastos</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                Cargando...
              </div>
            ) : (
              <CategoryPieChart data={expenseCategories} title="" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Categoría</CardTitle>
            <CardDescription>Distribución de ingresos</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                Cargando...
              </div>
            ) : (
              <CategoryPieChart data={incomeCategories} title="" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balance por Cuenta</CardTitle>
            <CardDescription>Distribución del balance total por cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                Cargando...
              </div>
            ) : (
              <AccountBalancePieChart data={accountBalanceBreakdown} title="" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Presupuestos Mensuales */}
      <Card>
        <CardHeader>
          <CardTitle>Analítica de Presupuesto Mensual</CardTitle>
          <CardDescription>
            Vista detallada de ahorros, ingresos, gastos y balance por presupuesto mensual
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAnalytics ? (
            <div className="flex h-[350px] items-center justify-center text-muted-foreground">
              Cargando...
            </div>
          ) : (
            <MonthlyPeriodsAnalyticsTable
              data={monthlyPeriodsAnalytics}
              currentYear={analyticsYear}
              onYearChange={async (year) => {
                // Actualizar el año inmediatamente para feedback visual
                setAnalyticsYear(year)
                // Activar estado de carga solo para esta sección
                setIsLoadingAnalytics(true)
                try {
                  const result = await getMonthlyPeriodsAnalytics({
                    year,
                    order: "DESC",
                  })
                  if (result.status === "success") {
                    setMonthlyPeriodsAnalytics(result.data.data)
                  } else {
                    toast.error("Error al cargar presupuestos mensuales", {
                      description: result.errors[0]?.message || "Error desconocido",
                    })
                  }
                } catch (error) {
                  toast.error("Error al cargar presupuestos mensuales")
                } finally {
                  setIsLoadingAnalytics(false)
                }
              }}
              availableYears={availableYears}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

