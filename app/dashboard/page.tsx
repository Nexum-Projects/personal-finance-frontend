import { DashboardContent } from "./components/dashboard-content"
import {
  getAnalyticsSummary,
  getExpenseCategoryBreakdown,
  getIncomeCategoryBreakdown,
  getTrends,
  getAccountBalanceBreakdown,
} from "@/app/actions/analytics"

// Calcular fechas por defecto (último mes)
// Usar zona horaria de Guatemala (UTC-6)
function getDateInGuatemala(date: Date): string {
  // Formatear la fecha en la zona horaria de Guatemala
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guatemala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  return formatter.format(date)
}

function getDefaultDates() {
  const now = new Date()
  const endDate = new Date(now)
  const startDate = new Date(now)
  startDate.setMonth(startDate.getMonth() - 1)
  return {
    startDate: getDateInGuatemala(startDate),
    endDate: getDateInGuatemala(endDate),
  }
}

export default async function DashboardPage() {
  const dateRange = getDefaultDates()

  // Cargar datos iniciales en paralelo
  // Usar Promise.allSettled para evitar que un error detenga toda la carga
  const [summaryResult, expenseResult, incomeResult, trendsResult, balanceResult] =
    await Promise.allSettled([
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
        />
      </div>
    </div>
  )
}
