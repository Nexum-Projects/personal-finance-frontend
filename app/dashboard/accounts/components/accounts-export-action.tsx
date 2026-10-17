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
import type { I18nKey } from "@/utils/i18n/messages"

const COLUMNS = [
  "name",
  "accountType",
  "currentBalanceCents",
  "currency",
  "updatedAt",
] as const

type ReportRecord = Record<(typeof COLUMNS)[number], string>

const COLUMN_LABEL_KEYS: Record<keyof ReportRecord, I18nKey> = {
  name: "accounts.table.name",
  accountType: "accounts.table.type",
  currentBalanceCents: "accounts.table.balance",
  currency: "export.column.currency",
  updatedAt: "accounts.table.updatedAt",
}

export function AccountsExportAction() {
  const searchParams = useSearchParams()
  const { timeZoneIana, preferredLanguage, locale } = useUserPreferences()

  const { page, limit, order, orderBy, search, startDate, endDate } = useMemo(
    () => ({
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
      order: (searchParams.get("order") || "DESC") as "ASC" | "DESC",
      orderBy: (searchParams.get("orderBy") || "updatedAt") as
        | "createdAt"
        | "updatedAt"
        | "name"
        | "accountType"
        | "currentBalanceCents",
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
    rowsQuantity,
    sortDirection,
    sortedBy,
    loadForXlsx,
    loadBeforePrint,
    onReset,
    reportName,
    reportColumns,
    dialogProps,
  } = useExportAction({
    data: accounts,
    pageSize: limit,
    sort: { direction: order, field: orderBy },
    columnLabelKeys: COLUMN_LABEL_KEYS,
    reportNameKey: "export.report.accounts",
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
          orderBy: (sortedBy || orderBy) as
            | "createdAt"
            | "updatedAt"
            | "name"
            | "accountType"
            | "currentBalanceCents",
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
          throw new Error(result.errors[0]?.message)
        }
      }

      return allAccounts
    } else {
      const result = await findManyAccounts({
        page,
        limit: rowsQuantity,
        order: sortDirection,
        orderBy: (sortedBy || orderBy) as
          | "createdAt"
          | "updatedAt"
          | "name"
          | "accountType"
          | "currentBalanceCents",
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        pagination: true,
      })

      if (result.status === "success") {
        return result.data.data
      }
      throw new Error(result.errors[0]?.message)
    }
  }, [
    fullData,
    page,
    rowsQuantity,
    sortDirection,
    sortedBy,
    orderBy,
    search,
    startDate,
    endDate,
  ])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setAccounts([])
      onReset()
    }
  }

  const handlePDFClick = useReactToPrint({
    contentRef,
    documentTitle: reportName,
    onAfterPrint: () => {
      promiseResolveRef.current = null
    },
    onBeforePrint: () => loadBeforePrint(fetchAccounts, setAccounts),
  })

  const handleXLSXClick = async () => {
    const fetchedAccounts = await loadForXlsx(fetchAccounts)
    if (!fetchedAccounts) return

    const rows: ReportRecord[] = fetchedAccounts.map((account) => ({
      name: account.name,
      accountType: humanizeAccountType(account.accountType, preferredLanguage),
      currentBalanceCents: formatAmount(
        account.currentBalanceCents,
        account.currency
      ),
      currency: account.currency,
      updatedAt: formatDateShort(account.updatedAt),
    }))

    exportXLSX({
      columns: reportColumns,
      rows,
      documentName: reportName,
    })
  }

  return (
    <>
      <ExportActionsDialog
        {...dialogProps({
          onPDF: handlePDFClick,
          onXLSX: handleXLSXClick,
          onOpenChange: handleOpenChange,
        })}
      />
      <div ref={contentRef}>
        <PagePrint
          columns={reportColumns.map((column) => ({
            id: column.id,
            label: column.label,
            align: "left" as const,
          }))}
          rows={accounts.map((account): ReportRecord & { id: string } => ({
            id: account.id,
            name: account.name,
            accountType: humanizeAccountType(
              account.accountType,
              preferredLanguage
            ),
            currentBalanceCents: formatAmount(
              account.currentBalanceCents,
              account.currency
            ),
            currency: account.currency,
            updatedAt: formatDateShort(account.updatedAt),
          }))}
          title={reportName}
        />
      </div>
    </>
  )
}
