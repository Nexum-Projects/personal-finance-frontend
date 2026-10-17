"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/i18n-provider"

interface TablePaginationProps {
  readonly currentPage: number
  readonly totalPages: number
  readonly limit: number
  readonly totalObjects: number
  readonly itemCount: number
  readonly entity: string
  readonly disabled?: boolean
  readonly onPageChange: (page: number) => void
}

export function TablePagination({
  currentPage,
  totalPages,
  limit,
  totalObjects,
  itemCount,
  entity,
  disabled = false,
  onPageChange,
}: TablePaginationProps) {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {t("pagination.showing", {
          from: itemCount > 0 ? (currentPage - 1) * limit + 1 : 0,
          to: Math.min(currentPage * limit, totalObjects),
          total: totalObjects,
          entity,
        })}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || disabled}
        >
          {t("pagination.prev")}
        </Button>
        <div className="text-sm text-foreground">
          {t("pagination.pageOf", { page: currentPage, totalPages })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || disabled}
        >
          {t("pagination.next")}
        </Button>
      </div>
    </div>
  )
}
