import { DashboardContent } from "./components/dashboard-content"
import {
  getAnalyticsSummary,
  getExpenseCategoryBreakdown,
  getIncomeCategoryBreakdown,
  getTrends,
  getAccountBalanceBreakdown,
} from "@/app/actions/analytics"
import { getMonthlyPeriodsAnalytics } from "@/app/actions/monthly-periods/analytics"
import { findManyMonthlyPeriods } from "@/app/actions/monthly-periods"
import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { timeZoneToIana } from "@/utils/user-preferences"

// Calcular fechas por defecto (último mes)
function getDateInTimeZone(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  return formatter.format(date)
}

function getDefaultDates(timeZone: string) {
  const now = new Date()
  const endDate = new Date(now)
  const startDate = new Date(now)
  startDate.setMonth(startDate.getMonth() - 1)
  return {
    startDate: getDateInTimeZone(startDate, timeZone),
    endDate: getDateInTimeZone(endDate, timeZone),
  }
}

export default async function DashboardPage() {
  const preferences = await getSessionPreferences()
  const timeZoneIana = timeZoneToIana(preferences.timeZone)
  const dateRange = getDefaultDates(timeZoneIana)
  const currentYear = new Date().getFullYear()

  // Primero obtener los períodos para determinar el año inicial
  const periodsResult = await Promise.allSettled([
    findManyMonthlyPeriods({
      page: 1,
      limit: 100,
      pagination: false,
    }),
  ])

  const periods =
    periodsResult[0].status === "fulfilled" && periodsResult[0].value.status === "success"
      ? periodsResult[0].value.data.data
      : []
  const availableYears = Array.from(
    new Set(periods.map((p) => p.year))
  ).sort((a, b) => b - a) // Ordenar de mayor a menor

  // Determinar el año inicial: usar el año que tiene datos, o el año actual si no hay datos
  const analyticsYear = availableYears.length > 0 ? availableYears[0] : currentYear

  // Cargar datos iniciales en paralelo
  // Usar Promise.allSettled para evitar que un error detenga toda la carga
  const [
    summaryResult,
    expenseResult,
    incomeResult,
    trendsResult,
    balanceResult,
    monthlyPeriodsResult,
  ] = await Promise.allSettled([
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
      groupBy: "day", // Valor por defecto, se puede cambiar desde el cliente
    }),
    getAccountBalanceBreakdown(),
    getMonthlyPeriodsAnalytics({
      year: analyticsYear,
      order: "DESC",
    }),
  ])

  const summary =
    summaryResult.status === "fulfilled" && summaryResult.value.status === "success"
      ? summaryResult.value.data
      : null
  const expenseCategories =
    expenseResult.status === "fulfilled" && expenseResult.value.status === "success"
      ? expenseResult.value.data
      : []
  const incomeCategories =
    incomeResult.status === "fulfilled" && incomeResult.value.status === "success"
      ? incomeResult.value.data
      : []
  const trends =
    trendsResult.status === "fulfilled" && trendsResult.value.status === "success"
      ? trendsResult.value.data
      : []
  const accountBalanceBreakdown =
    balanceResult.status === "fulfilled" && balanceResult.value.status === "success"
      ? balanceResult.value.data
      : []
  const monthlyPeriodsAnalytics =
    monthlyPeriodsResult.status === "fulfilled" &&
    monthlyPeriodsResult.value.status === "success"
      ? monthlyPeriodsResult.value.data.data
      : []
  const totalAccounts = summary?.totalAccounts ?? 0

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardContent
          initialSummary={summary}
          initialExpenseCategories={expenseCategories}
          initialIncomeCategories={incomeCategories}
          initialTrends={trends}
          initialTotalAccounts={totalAccounts}
          initialAccountBalanceBreakdown={accountBalanceBreakdown}
          initialMonthlyPeriodsAnalytics={monthlyPeriodsAnalytics}
          initialAnalyticsYear={analyticsYear}
          availableYears={availableYears.length > 0 ? availableYears : [currentYear]}
        />
      </div>
    </div>
  )
}
