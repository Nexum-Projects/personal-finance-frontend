"use client"

import { useEffect, useMemo, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { AccountBalanceBreakdown } from "@/app/actions/analytics/types"
import { formatAmount } from "@/utils/helpers/format-amount"
import { humanizeAccountType } from "@/utils/helpers/humanize-account-type"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"
import { cn } from "@/lib/utils"

interface AccountBalancePieChartProps {
  data: AccountBalanceBreakdown[]
  title: string
}

// Colores para las cuentas (paleta de colores)
const COLORS = [
  "hsl(217, 91%, 60%)", // Blue
  "hsl(142, 76%, 36%)", // Green
  "hsl(0, 72%, 51%)", // Red
  "hsl(280, 70%, 50%)", // Purple
  "hsl(40, 90%, 50%)", // Orange
  "hsl(200, 90%, 50%)", // Cyan
  "hsl(320, 70%, 50%)", // Pink
  "hsl(160, 70%, 50%)", // Teal
  "hsl(25, 95%, 53%)", // Orange Red
  "hsl(260, 70%, 50%)", // Indigo
]

export function AccountBalancePieChart({ data, title }: AccountBalancePieChartProps) {
  const { preferredCurrency, preferredLanguage } = useUserPreferences()
  const { t } = useI18n()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setSelectedIds(new Set(data.map((item) => item.accountId)))
  }, [data])

  const selectedTotalCents = useMemo(() => {
    return data.reduce((sum, item) => {
      if (!selectedIds.has(item.accountId)) return sum
      return sum + item.balanceCents
    }, 0)
  }, [data, selectedIds])

  const chartData = useMemo(() => {
    if (selectedTotalCents <= 0) return []
    return data
      .map((item, colorIndex) => ({ item, colorIndex }))
      .filter(({ item }) => selectedIds.has(item.accountId))
      .map(({ item, colorIndex }) => ({
        accountId: item.accountId,
        name: item.accountName,
        value: item.balanceCents / 100,
        percentage: (item.balanceCents / selectedTotalCents) * 100,
        accountType: item.accountType,
        colorIndex,
      }))
  }, [data, selectedIds, selectedTotalCents])

  const formatCurrency = (value: number) => {
    return formatAmount(Math.round(value * 100), preferredCurrency)
  }

  const toggleAccount = (accountId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(accountId)) {
        next.delete(accountId)
      } else {
        next.add(accountId)
      }
      return next
    })
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const row = payload[0]
      return (
        <div className="rounded-lg border bg-card p-3 shadow-md">
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">
            {humanizeAccountType(row.payload.accountType, preferredLanguage)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(row.value)} ({row.payload.percentage.toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  const selectedTotalFormatted = formatAmount(selectedTotalCents, preferredCurrency)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {data.length === 0 ? (
        <div className="flex h-[350px] items-center justify-center text-muted-foreground">
          No hay datos disponibles
        </div>
      ) : (
        <>
          <p className="text-sm font-medium tabular-nums">
            {t("dashboard.pies.balanceByAccount.selectedTotal", { value: selectedTotalFormatted })}
          </p>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
            <div className="flex-1 min-w-0 xl:min-w-[300px]">
              {chartData.length === 0 ? (
                <div className="flex h-[350px] items-center justify-center px-4 text-center text-sm text-muted-foreground">
                  {t("dashboard.pies.balanceByAccount.noneSelected")}
                </div>
              ) : (
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
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.accountId}
                          fill={COLORS[entry.colorIndex % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="w-full xl:w-56 xl:flex-shrink-0">
              <div className="max-h-[350px] overflow-y-auto rounded-md border bg-card p-4">
                <div className="space-y-2">
                  {data.map((item, index) => {
                    const color = COLORS[index % COLORS.length]
                    const checked = selectedIds.has(item.accountId)
                    const shareOfSelected =
                      checked && selectedTotalCents > 0
                        ? (item.balanceCents / selectedTotalCents) * 100
                        : null
                    return (
                      <label
                        key={item.accountId}
                        className={cn(
                          "flex cursor-pointer items-start gap-2 rounded-md p-1 text-sm transition-colors hover:bg-muted/50",
                          !checked && "opacity-60",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAccount(item.accountId)}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-primary text-primary focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={item.accountName}
                        />
                        <div className="flex min-w-0 flex-1 items-start gap-2" style={{ color }}>
                          <div
                            className="mt-1 h-3 w-3 shrink-0 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-foreground">
                              {item.accountName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatCurrency(item.balanceCents / 100)}
                              {shareOfSelected != null && (
                                <> ({shareOfSelected.toFixed(1)}%)</>
                              )}
                            </div>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
