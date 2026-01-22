"use client"

import * as React from "react"
import { useState } from "react"
import { useReactToPrint } from "react-to-print"
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PagePrint } from "@/components/display/page-print"
import { exportXLSX } from "@/utils/helpers/export-xlsx"
import { useI18n } from "@/components/i18n/i18n-provider"

type Column<K extends string> = {
  id: K
  label: string
}

type Row<K extends string> = Record<K, string> & { id?: string }

type Props<K extends string> = {
  columns: Column<K>[]
  rows: Row<K>[]
  documentName: string
  title: string
}

export function SimpleExportButtons<K extends string>({
  columns,
  rows,
  documentName,
  title,
}: Props<K>) {
  const { t } = useI18n()
  const [isExporting, setIsExporting] = useState<"PDF" | "XLSX" | null>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const promiseResolveRef = React.useRef<
    ((value?: PromiseLike<void> | void) => void) | null
  >(null)

  const handlePDFClick = useReactToPrint({
    contentRef,
    documentTitle: documentName,
    onAfterPrint: () => {
      promiseResolveRef.current = null
      setIsExporting(null)
    },
    onBeforePrint: () => {
      return new Promise((resolve) => {
        setIsExporting("PDF")
        promiseResolveRef.current = resolve
        // Resolver inmediatamente si ya hay datos, o esperar un tick para que el DOM se actualice
        if (rows.length > 0) {
          setTimeout(() => {
            if (promiseResolveRef.current) {
              promiseResolveRef.current()
            }
          }, 100)
        }
      })
    },
  })

  React.useEffect(() => {
    if (rows.length > 0 && promiseResolveRef.current) {
      // Usar setTimeout para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        if (promiseResolveRef.current) {
          promiseResolveRef.current()
        }
      }, 100)
    }
  }, [rows])

  const handleXLSXClick = async () => {
    setIsExporting("XLSX")
    exportXLSX({
      columns: columns.map((col) => ({ id: col.id, label: col.label })),
      rows,
      documentName,
    })
    setIsExporting(null)
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleXLSXClick}
          disabled={!!isExporting || rows.length === 0}
        >
          {isExporting === "XLSX" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          {t("export.toExcel")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePDFClick}
          disabled={!!isExporting || rows.length === 0}
        >
          {isExporting === "PDF" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          {t("export.toPDF")}
        </Button>
      </div>
      <PagePrint
        ref={contentRef}
        columns={columns.map((col) => ({
          id: col.id,
          label: col.label,
          align: "left" as const,
        }))}
        rows={rows}
        title={title}
      />
    </>
  )
}
