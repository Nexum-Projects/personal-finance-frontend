"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { CategoryBreakdown } from "@/app/actions/analytics/types"
import { formatAmount } from "@/utils/helpers/format-amount"

interface PieChartProps {
  data: CategoryBreakdown[]
  title: string
}

// Colores para las categorías (paleta de colores)
const COLORS = [
  "hsl(217, 91%, 60%)", // Blue
  "hsl(142, 76%, 36%)", // Green
  "hsl(0, 72%, 51%)", // Red
  "hsl(280, 70%, 50%)", // Purple
  "hsl(40, 90%, 50%)", // Orange
  "hsl(200, 90%, 50%)", // Cyan
  "hsl(320, 70%, 50%)", // Pink
  "hsl(160, 70%, 50%)", // Teal
]

export function CategoryPieChart({ data, title }: PieChartProps) {
  // Formatear datos para la gráfica
  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: item.totalAmountCents / 100,
    percentage: item.percentage,
    count: item.transactionCount,
  }))

  const formatCurrency = (value: number) => {
    return formatAmount(Math.round(value * 100), "GT")
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="rounded-lg border bg-card p-3 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.payload.percentage.toFixed(1)}%)
          </p>
          <p className="text-xs text-muted-foreground">
            {data.payload.count} transacciones
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {chartData.length === 0 ? (
        <div className="flex h-[350px] items-center justify-center text-muted-foreground">
          No hay datos disponibles
        </div>
      ) : (
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
          {/* Gráfica de pastel */}
          <div className="flex-1 min-w-0 xl:min-w-[300px]">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Leyendas con scroll */}
          <div className="w-full xl:w-56 xl:flex-shrink-0">
            <div className="max-h-[350px] overflow-y-auto rounded-md border bg-card p-4">
              <div className="space-y-2">
                {chartData.map((entry, index) => {
                  const color = COLORS[index % COLORS.length]
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                      style={{ color }}
                    >
                      <div
                        className="h-4 w-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{entry.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(entry.value)} ({entry.percentage.toFixed(1)}%)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.count} transacciones
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

