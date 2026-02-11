"use client"

import { useCallback, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useReactToPrint } from "react-to-print"
import { findManyAccounts } from "@/app/actions/accounts"
import { ExportActionsDialog } from "@/components/display/export-actions-dialog"
import { PagePrint } from "@/components/display/page-print"
import { useExportAction } from "@/hooks/use-export-action"
import { exportXLSX } from "@/utils/helpers/export-xlsx"
import { formatAmount } from "@/utils/helpers/format-amount"
import { humanizeAccountType } from "@/utils/helpers/humanize-account-type"
import type { Account } from "@/app/actions/accounts/types"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"

const COLUMNS = ["name", "accountType", "currentBalanceCents", "currency", "updatedAt"] as const

type ReportRecord = Record<(typeof COLUMNS)[number], string>

const HUMANIZED_COLUMNS: ReportRecord = {
  name: "Nombre",
  accountType: "Tipo",
  currentBalanceCents: "Balance",
  currency: "Moneda",
  updatedAt: "Fecha de actualización",
}

const REPORT_COLUMNS: {
  id: keyof ReportRecord
  label: string
}[] = [
  { id: "name", label: HUMANIZED_COLUMNS.name },
  { id: "accountType", label: HUMANIZED_COLUMNS.accountType },
  { id: "currentBalanceCents", label: HUMANIZED_COLUMNS.currentBalanceCents },
  { id: "currency", label: HUMANIZED_COLUMNS.currency },
  { id: "updatedAt", label: HUMANIZED_COLUMNS.updatedAt },
]

const REPORT_NAME = "Reporte de Cuentas"

export function AccountsExportAction() {
  const searchParams = useSearchParams()
  const { preferredCurrency, timeZoneIana, preferredLanguage, locale } = useUserPreferences()
  const { t } = useI18n()

  const { page, limit, order, orderBy, search, startDate, endDate } = useMemo(
    () => ({
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
      order: (searchParams.get("order") || "DESC") as "ASC" | "DESC",
      orderBy: (searchParams.get("orderBy") || "updatedAt") as "createdAt" | "updatedAt" | "name" | "accountType" | "currentBalanceCents",
      search: searchParams.get("search") || "",
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    }),
    [searchParams]
  )

  const [accounts, setAccounts] = useState<Account[]>([])

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
    data: accounts,
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

  const fetchAccounts = useCallback(async () => {
    if (fullData) {
      // Para obtener todos los datos, hacemos múltiples requests paginados
      let allAccounts: Account[] = []
      let currentPage = 1
      const pageSize = 100

      while (true) {
        const result = await findManyAccounts({
          page: currentPage,
          limit: pageSize,
          order: sortDirection,
          orderBy: (sortedBy || orderBy) as "createdAt" | "updatedAt" | "name" | "accountType" | "currentBalanceCents",
          search: search || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          pagination: true,
        })

        if (result.status === "success") {
          allAccounts = [...allAccounts, ...result.data.data]
          if (currentPage >= result.data.meta.totalPages) {
            break
          }
          currentPage++
        } else {
          break
        }
      }

      return allAccounts
    } else {
      const result = await findManyAccounts({
        page,
        limit: rowsQuantity,
        order: sortDirection,
        orderBy: (sortedBy || orderBy) as "createdAt" | "updatedAt" | "name" | "accountType" | "currentBalanceCents",
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
      setAccounts([])
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

        const fetchedAccounts = await fetchAccounts()

        setAccounts(fetchedAccounts)

        promiseResolveRef.current = resolve
      })
    },
  })

  const handleXLSXClick = async () => {
    onIsExportingChange("XLSX")

    const fetchedAccounts = await fetchAccounts()

    const rows: ReportRecord[] = fetchedAccounts.map((account) => ({
      name: account.name,
      accountType: humanizeAccountType(account.accountType, preferredLanguage),
      currentBalanceCents: formatAmount(account.currentBalanceCents, account.currency),
      currency: account.currency,
      updatedAt: formatDateShort(account.updatedAt),
    }))

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
      <div ref={contentRef}>
        <PagePrint
          columns={REPORT_COLUMNS.map((column) => ({
            id: column.id,
            label: column.label,
            align: "left" as const,
          }))}
          rows={accounts.map((account): ReportRecord & { id: string } => ({
            id: account.id,
            name: account.name,
            accountType: humanizeAccountType(account.accountType, preferredLanguage),
            currentBalanceCents: formatAmount(account.currentBalanceCents, account.currency),
            currency: account.currency,
            updatedAt: formatDateShort(account.updatedAt),
          }))}
          title={REPORT_NAME}
        />
      </div>
    </>
  )
}
