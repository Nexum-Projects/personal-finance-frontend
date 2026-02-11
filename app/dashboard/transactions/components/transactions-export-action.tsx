"use client"

import { useCallback, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useReactToPrint } from "react-to-print"
import { findManyTransactions } from "@/app/actions/transactions"
import { ExportActionsDialog } from "@/components/display/export-actions-dialog"
import { PagePrint } from "@/components/display/page-print"
import { useExportAction } from "@/hooks/use-export-action"
import { exportXLSX } from "@/utils/helpers/export-xlsx"
import { formatAmount } from "@/utils/helpers/format-amount"
import { formatTransactionDateAsIs } from "@/utils/helpers/format-date-only"
import type { Transaction } from "@/app/actions/transactions/types"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"

const COLUMNS = ["amountCents", "description", "category", "account", "type", "transactionDate"] as const

type ReportRecord = Record<(typeof COLUMNS)[number], string>

const HUMANIZED_COLUMNS: ReportRecord = {
  amountCents: "Monto",
  description: "Descripción",
  category: "Categoría",
  account: "Cuenta",
  type: "Tipo",
  transactionDate: "Fecha",
}

const REPORT_COLUMNS: {
  id: keyof ReportRecord
  label: string
}[] = [
  { id: "amountCents", label: HUMANIZED_COLUMNS.amountCents },
  { id: "description", label: HUMANIZED_COLUMNS.description },
  { id: "category", label: HUMANIZED_COLUMNS.category },
  { id: "account", label: HUMANIZED_COLUMNS.account },
  { id: "type", label: HUMANIZED_COLUMNS.type },
  { id: "transactionDate", label: HUMANIZED_COLUMNS.transactionDate },
]

const REPORT_NAME = "Reporte de Transacciones"

export function TransactionsExportAction() {
  const searchParams = useSearchParams()
  const { preferredCurrency, timeZoneIana, locale } = useUserPreferences()
  const { t } = useI18n()

  const { page, limit, order, orderBy, search, startDate, endDate, categoryId, accountId } = useMemo(
    () => ({
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
      order: (searchParams.get("order") || "DESC") as "ASC" | "DESC",
      orderBy: (searchParams.get("orderBy") || "updatedAt") as "createdAt" | "updatedAt" | "transactionDate" | "amountCents",
      search: searchParams.get("search") || "",
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      accountId: searchParams.get("accountId") || undefined,
    }),
    [searchParams]
  )

  const [transactions, setTransactions] = useState<Transaction[]>([])

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
    data: transactions,
    pageSize: limit,
    sort: { direction: order, field: orderBy },
  })

  const fetchTransactions = useCallback(async () => {
    if (fullData) {
      // Para obtener todos los datos, hacemos múltiples requests paginados
      let allTransactions: Transaction[] = []
      let currentPage = 1
      const pageSize = 100

      while (true) {
        const result = await findManyTransactions({
          page: currentPage,
          limit: pageSize,
          order: sortDirection,
          orderBy: (sortedBy || orderBy) as "createdAt" | "updatedAt" | "transactionDate" | "amountCents",
          search: search || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          categoryId: categoryId || undefined,
          accountId: accountId || undefined,
          pagination: true,
        })

        if (result.status === "success") {
          allTransactions = [...allTransactions, ...result.data.data]
          if (currentPage >= result.data.meta.totalPages) {
            break
          }
          currentPage++
        } else {
          break
        }
      }

      return allTransactions
    } else {
      const result = await findManyTransactions({
        page,
        limit: rowsQuantity,
        order: sortDirection,
        orderBy: (sortedBy || orderBy) as "createdAt" | "updatedAt" | "transactionDate" | "amountCents",
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        categoryId: categoryId || undefined,
        accountId: accountId || undefined,
        pagination: true,
      })

      if (result.status === "success") {
        return result.data.data
      }
      return []
    }
  }, [fullData, page, rowsQuantity, sortDirection, sortedBy, orderBy, search, startDate, endDate, categoryId, accountId])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTransactions([])
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

        const fetchedTransactions = await fetchTransactions()

        setTransactions(fetchedTransactions)

        promiseResolveRef.current = resolve
      })
    },
  })

  const handleXLSXClick = async () => {
    onIsExportingChange("XLSX")

    const fetchedTransactions = await fetchTransactions()

    const rows: ReportRecord[] = fetchedTransactions.map((transaction) => {
      const isIncome = transaction.category.categoryType === "INCOME"
      const amountDisplay = isIncome
        ? `+${formatAmount(transaction.amountCents, preferredCurrency)}`
        : `-${formatAmount(transaction.amountCents, preferredCurrency)}`

      return {
        amountCents: amountDisplay,
        description: transaction.description,
        category: transaction.category.name,
        account: transaction.account.name,
        type: isIncome ? t("transactions.type.income") : t("transactions.type.expense"),
        transactionDate: formatTransactionDateAsIs(transaction.transactionDate),
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
      <div ref={contentRef}>
        <PagePrint
          columns={REPORT_COLUMNS.map((column) => ({
            id: column.id,
            label: column.label,
            align: "left" as const,
          }))}
          rows={transactions.map((transaction): ReportRecord & { id: string } => {
            const isIncome = transaction.category.categoryType === "INCOME"
            const amountDisplay = isIncome
              ? `+${formatAmount(transaction.amountCents, preferredCurrency)}`
              : `-${formatAmount(transaction.amountCents, preferredCurrency)}`

            return {
              id: transaction.id,
              amountCents: amountDisplay,
              description: transaction.description,
              category: transaction.category.name,
              account: transaction.account.name,
              type: isIncome ? t("transactions.type.income") : t("transactions.type.expense"),
              transactionDate: formatTransactionDateAsIs(transaction.transactionDate),
            }
          })}
          title={REPORT_NAME}
        />
      </div>
    </>
  )
}
