"use client"

import { useCallback, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useReactToPrint } from "react-to-print"
import { findManyTransfers } from "@/app/actions/transfers"
import { ExportActionsDialog } from "@/components/display/export-actions-dialog"
import { PagePrint } from "@/components/display/page-print"
import { useExportAction } from "@/hooks/use-export-action"
import { exportXLSX } from "@/utils/helpers/export-xlsx"
import { formatAmount } from "@/utils/helpers/format-amount"
import { formatDateOnlyShort } from "@/utils/helpers/format-date-only"
import type { Transfer } from "@/app/actions/transfers"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"

const COLUMNS = ["transferDate", "fromAccount", "toAccount", "amountCents", "description", "updatedAt"] as const

type ReportRecord = Record<(typeof COLUMNS)[number], string>

const HUMANIZED_COLUMNS: ReportRecord = {
  transferDate: "Fecha",
  fromAccount: "Cuenta Origen",
  toAccount: "Cuenta Destino",
  amountCents: "Monto",
  description: "Descripción",
  updatedAt: "Fecha de actualización",
}

const REPORT_COLUMNS: {
  id: keyof ReportRecord
  label: string
}[] = [
  { id: "transferDate", label: HUMANIZED_COLUMNS.transferDate },
  { id: "fromAccount", label: HUMANIZED_COLUMNS.fromAccount },
  { id: "toAccount", label: HUMANIZED_COLUMNS.toAccount },
  { id: "amountCents", label: HUMANIZED_COLUMNS.amountCents },
  { id: "description", label: HUMANIZED_COLUMNS.description },
  { id: "updatedAt", label: HUMANIZED_COLUMNS.updatedAt },
]

const REPORT_NAME = "Reporte de Transferencias"

export function TransfersExportAction() {
  const searchParams = useSearchParams()
  const { preferredCurrency, timeZoneIana, locale } = useUserPreferences()
  const { t } = useI18n()

  const { page, limit, order, orderBy, search, startDate, endDate } = useMemo(
    () => ({
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
      order: (searchParams.get("order") || "DESC") as "ASC" | "DESC",
      orderBy: (searchParams.get("orderBy") || "updatedAt") as "createdAt" | "updatedAt" | "transferDate" | "amountCents",
      search: searchParams.get("search") || "",
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    }),
    [searchParams]
  )

  const [transfers, setTransfers] = useState<Transfer[]>([])

  const {
    contentRef,
    promiseResolveRef,
    fullData,
    isExporting,
    rowsQuantity,
    sortDirection,
    sortedBy,
    onFullDataChange,
    onIsExportingChange,
    onReset,
    onRowsQtyChange,
    onSortDirectionChange,
    onSortedByChange,
  } = useExportAction({
    data: transfers,
    pageSize: limit,
    sort: { direction: order, field: orderBy },
  })

  const formatDateShort = (dateString: string): string => {
    try {
      const d = new Date(dateString)
      return new Intl.DateTimeFormat(locale, {
        timeZone: timeZoneIana,
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      }).format(d)
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string): string => {
    try {
      const d = new Date(dateString)
      return new Intl.DateTimeFormat(locale, {
        timeZone: timeZoneIana,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d)
    } catch {
      return dateString
    }
  }

  const fetchTransfers = useCallback(async () => {
    if (fullData) {
      // Para obtener todos los datos, hacemos múltiples requests paginados
      let allTransfers: Transfer[] = []
      let currentPage = 1
      const pageSize = 100

      while (true) {
        const result = await findManyTransfers({
          page: currentPage,
          limit: pageSize,
          order: sortDirection,
          orderBy: (sortedBy || orderBy) as "createdAt" | "updatedAt" | "transferDate" | "amountCents",
          search: search || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          pagination: true,
        })

        if (result.status === "success") {
          allTransfers = [...allTransfers, ...result.data.data]
          if (currentPage >= result.data.meta.totalPages) {
            break
          }
          currentPage++
        } else {
          break
        }
      }

      return allTransfers
    } else {
      const result = await findManyTransfers({
        page,
        limit: rowsQuantity,
        order: sortDirection,
        orderBy: (sortedBy || orderBy) as "createdAt" | "updatedAt" | "transferDate" | "amountCents",
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        pagination: true,
      })

      if (result.status === "success") {
        return result.data.data
      }
      return []
    }
  }, [fullData, page, rowsQuantity, sortDirection, sortedBy, orderBy, search, startDate, endDate])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTransfers([])
      onReset()
    }
  }

  const handlePDFClick = useReactToPrint({
    contentRef,
    documentTitle: REPORT_NAME,
    onAfterPrint: () => {
      promiseResolveRef.current = null
    },
    onBeforePrint: () => {
      return new Promise(async (resolve) => {
        onIsExportingChange("PDF")

        const fetchedTransfers = await fetchTransfers()

        setTransfers(fetchedTransfers)

        promiseResolveRef.current = resolve
      })
    },
  })

  const handleXLSXClick = async () => {
    onIsExportingChange("XLSX")

    const fetchedTransfers = await fetchTransfers()

    const rows: ReportRecord[] = fetchedTransfers.map((transfer) => {
      return {
        transferDate: formatDateShort(transfer.transferDate),
        fromAccount: transfer.fromAccount.name,
        toAccount: transfer.toAccount.name,
        amountCents: formatAmount(transfer.amountCents, preferredCurrency),
        description: transfer.description,
        updatedAt: formatDateTime(transfer.updatedAt),
      }
    })

    exportXLSX({
      columns: REPORT_COLUMNS,
      rows,
      documentName: REPORT_NAME,
    })

    onIsExportingChange(null)
  }

  return (
    <>
      <ExportActionsDialog
        actions={{
          PDF: {
            onClick: handlePDFClick,
            isLoading: isExporting === "PDF",
            disabled: !!isExporting,
          },
          XLSX: {
            onClick: handleXLSXClick,
            isLoading: isExporting === "XLSX",
            disabled: !!isExporting,
          },
        }}
        description={t("export.description")}
        options={{
          fullData: {
            value: fullData,
            onChange: onFullDataChange,
          },
          rowsQuantity: {
            value: rowsQuantity,
            onChange: onRowsQtyChange,
          },
          sorting: {
            items: Object.fromEntries(
              COLUMNS.map((column) => [
                column,
                {
                  label: HUMANIZED_COLUMNS[column],
                  value: column,
                },
              ])
            ),
            onSortDirectionChange,
            onSortedByChange,
            sortedBy,
            sortDirection,
          },
        }}
        title={t("export.title")}
        onOpenChange={handleOpenChange}
      />
      <PagePrint
        ref={contentRef}
        columns={REPORT_COLUMNS.map((column) => ({
          id: column.id,
          label: column.label,
          align: "left" as const,
        }))}
        rows={transfers.map((transfer): ReportRecord & { id: string } => {
          return {
            id: transfer.id,
            transferDate: formatDateShort(transfer.transferDate),
            fromAccount: transfer.fromAccount.name,
            toAccount: transfer.toAccount.name,
            amountCents: formatAmount(transfer.amountCents, preferredCurrency),
            description: transfer.description,
            updatedAt: formatDateTime(transfer.updatedAt),
          }
        })}
        title={REPORT_NAME}
      />
    </>
  )
}
