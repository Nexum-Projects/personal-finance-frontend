"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { TrendData } from "@/app/actions/analytics/types"
import { formatAmount } from "@/utils/helpers/format-amount"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"

interface TrendsChartProps {
  data: TrendData[]
}

export function TrendsChart({ data }: TrendsChartProps) {
  const { preferredCurrency, timeZoneIana } = useUserPreferences()
  // Formatear fecha con año para el eje X
  const formatDateWithYear = (dateString: string): string => {
    try {
      // Si la fecha viene en formato YYYY-MM-DD, parsearla directamente
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split("-").map(Number)
        const date = new Date(year, month - 1, day)
        return date.toLocaleDateString("es-GT", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      }
      
      // Si tiene información de hora, usar el método normal pero en zona horaria de Guatemala
      const date = new Date(dateString)
      return date.toLocaleDateString("es-GT", {
        timeZone: timeZoneIana,
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  // Formatear datos para la gráfica
  const chartData = data.map((item) => ({
    date: formatDateWithYear(item.date),
    Ingresos: item.incomeCents / 100,
    Gastos: item.expensesCents / 100,
    Neto: item.netAmountCents / 100,
    Ahorros: item.savingsCents / 100,
  }))

  const formatCurrency = (value: number) => {
    return formatAmount(Math.round(value * 100), preferredCurrency)
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
          formatter={(value?: number) => formatCurrency(value ?? 0)}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Ingresos"
          stroke="hsl(142, 76%, 36%)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Gastos"
          stroke="hsl(0, 72%, 51%)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Neto"
          stroke="hsl(217, 91%, 60%)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Ahorros"
          stroke="hsl(38, 92%, 50%)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

