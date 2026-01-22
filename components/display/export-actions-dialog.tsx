"use client"

import { Download, FileSpreadsheet, FileText, Loader2, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useI18n } from "@/components/i18n/i18n-provider"
import type { ExportType } from "@/hooks/use-export-action"

type ExportAction = {
  disabled?: boolean
  isLoading?: boolean
  onClick: () => Promise<void> | void
}

type Props = {
  actions: Record<ExportType, ExportAction>
  description?: string
  title?: string
  onOpenChange?: (open: boolean) => void
  options: {
    fullData: {
      value: boolean
      onChange: (value: boolean) => void
    }
    rowsQuantity: {
      value: number
      onChange: (value: number) => void
    }
    sorting: {
      sortDirection: "ASC" | "DESC"
      sortedBy: string | null
      onSortDirectionChange: () => void
      onSortedByChange: (value: string | null) => void
      items: Record<string, { label: string; value: string }>
    }
  }
}

const PAGE_SIZES = [10, 25, 50, 100]

export function ExportActionsDialog({
  description,
  title,
  actions,
  onOpenChange,
  options: { fullData, rowsQuantity, sorting },
}: Props) {
  const { t } = useI18n()

  const isExportType = (key: string): key is ExportType => {
    return key === "PDF" || key === "XLSX"
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-fit" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {t("export.title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl p-4 lg:p-6 max-w-2xl">
        <DialogHeader className="text-left">
          <div className="space-y-1.5">
            <DialogTitle>{title || t("export.title")}</DialogTitle>
            <DialogDescription className="text-pretty">
              {description || t("export.description")}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-1">
          {/* Full Data Switch */}
          <div className="flex flex-row items-center gap-3">
            <div className="grid flex-1 gap-0.5">
              <Label
                className="text-sm leading-4 font-medium"
                htmlFor="full-data"
              >
                {t("export.fullData")}
              </Label>
              <p className="text-xs text-muted-foreground leading-4 text-pretty">
                {t("export.fullDataDesc")}
              </p>
            </div>

            <Switch
              checked={fullData.value}
              id="full-data"
              onCheckedChange={fullData.onChange}
            />
          </div>

          {/* Sorting Select */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="grid flex-1 gap-0.5">
              <Label className="text-sm leading-4 font-medium">
                {t("export.sortBy")}
              </Label>
              <p className="text-xs text-muted-foreground leading-4 text-pretty">
                {t("export.sortByDesc")}
              </p>
            </div>
            <div className="grid w-full shrink-0 grid-cols-[minmax(0_,1fr)_36px] gap-2 md:w-fit md:grid-cols-[176px_36px]">
              <Select
                value={sorting.sortedBy || ""}
                onValueChange={sorting.onSortedByChange}
              >
                <SelectTrigger className="h-9 px-2 py-1.5">
                  <SelectValue placeholder={t("export.selectField")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(sorting.items).map(([key, item]) => (
                    <SelectItem key={key} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="grid size-9 place-items-center"
                disabled={!sorting.sortedBy}
                size="icon"
                variant="outline"
                onClick={sorting.onSortDirectionChange}
              >
                <ArrowDown
                  className={cn(
                    "size-3.5 transition-transform duration-300 ease-out",
                    {
                      "rotate-180": sorting.sortDirection === "ASC",
                    }
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Rows Quantity Select */}
          <div className="flex flex-row items-center gap-2">
            <div
              className={cn("grid flex-1 gap-0.5", {
                "pointer-events-none opacity-50": fullData.value,
              })}
            >
              <Label className="text-sm leading-4 font-medium">
                {t("export.rowsQuantity")}
              </Label>
              <p className="text-xs text-muted-foreground leading-4 text-pretty">
                {t("export.rowsQuantityDesc")}
              </p>
            </div>

            <Select
              value={String(rowsQuantity.value)}
              disabled={fullData.value}
              onValueChange={(value) => {
                rowsQuantity.onChange(Number(value))
              }}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue placeholder={String(rowsQuantity.value)} />
              </SelectTrigger>
              <SelectContent align="end">
                {PAGE_SIZES.map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {String(pageSize)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(actions).map(
            ([key, { onClick, isLoading, disabled }]) => {
              if (!isExportType(key)) {
                return null
              }

              const isPDF = key === "PDF"
              const Icon = isPDF ? FileText : FileSpreadsheet

              return (
                <Button
                  key={key}
                  className={cn(
                    "bg-surface text-muted-foreground grid h-32 cursor-pointer place-items-center content-center gap-2 rounded-lg border transition-colors duration-500",
                    isPDF
                      ? "hover:border-rose-600/30 hover:bg-rose-600/10 hover:text-rose-600 dark:hover:border-rose-500/30 dark:hover:bg-rose-600/10 dark:hover:text-rose-400"
                      : "hover:border-green-600/30 hover:bg-green-600/10 hover:text-green-600 dark:hover:border-green-600/30 dark:hover:bg-green-600/10 dark:hover:text-green-500"
                  )}
                  disabled={disabled}
                  type="button"
                  variant="outline"
                  onClick={onClick}
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <p className="text-center leading-5 whitespace-pre-line text-sm">
                    {isPDF ? t("export.toPDF") : t("export.toExcel")}
                  </p>
                </Button>
              )
            }
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
