"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useI18n } from "@/components/i18n/i18n-provider"
import type { I18nKey } from "@/utils/i18n/messages"

export type ExportType = "PDF" | "XLSX"

type SortDirection = "ASC" | "DESC"

// El efecto que resuelve la carga solo dispara con filas: sin ellas la exportación quedaría colgada.
const NO_DATA_ERROR = new Error("No data to export")

type Params<K extends string, C extends string, T> = {
  data: T[]
  pageSize: number
  sort: {
    direction: SortDirection
    field: K | null
  }
  /** Columnas del reporte, en orden, con la clave i18n de su encabezado. */
  columnLabelKeys: Record<C, I18nKey>
  reportNameKey: I18nKey
}

type DialogHandlers = {
  onPDF: () => void
  onXLSX: () => Promise<void>
  onOpenChange: (open: boolean) => void
}

export function useExportAction<K extends string, C extends string, T>({
  data,
  pageSize,
  sort: { direction, field },
  columnLabelKeys,
  reportNameKey,
}: Params<K, C, T>) {
  const [fullData, setFullData] = useState<boolean>(false)
  const [isExporting, setIsExporting] = useState<ExportType | null>(null)
  const [rowsQuantity, setRowsQuantity] = useState<number>(pageSize)
  const [sortDirection, setSortDirection] = useState<SortDirection>(direction)
  const [sortedBy, setSortedBy] = useState<K | null>(field)

  const { t } = useI18n()
  const contentRef = useRef<HTMLDivElement>(null)
  const promiseResolveRef = useRef<
    ((value?: PromiseLike<void> | void) => void) | null
  >(null)

  const notifyLoadError = useCallback(
    (error: unknown) =>
      toast.error(
        t(error === NO_DATA_ERROR ? "export.noData" : "export.loadError")
      ),
    [t]
  )

  // `onBeforePrint` de react-to-print: carga los datos y espera a que se rendericen.
  // Si la carga falla o no trae filas, rechaza para cancelar la impresión y limpia el estado.
  const loadBeforePrint = useCallback(
    async (fetchData: () => Promise<T[]>, setData: (data: T[]) => void) => {
      setIsExporting("PDF")
      try {
        const fetched = await fetchData()
        if (fetched.length === 0) throw NO_DATA_ERROR
        await new Promise<void>((resolve) => {
          promiseResolveRef.current = resolve
          setData(fetched)
        })
      } catch (error) {
        promiseResolveRef.current = null
        setIsExporting(null)
        notifyLoadError(error)
        throw error
      }
    },
    [notifyLoadError]
  )

  // Carga las filas del Excel. Si la carga falla o no trae filas, avisa y devuelve null para no descargar nada.
  const loadForXlsx = useCallback(
    async (fetchData: () => Promise<T[]>) => {
      setIsExporting("XLSX")
      try {
        const fetched = await fetchData()
        if (fetched.length === 0) throw NO_DATA_ERROR
        return fetched
      } catch (error) {
        notifyLoadError(error)
        return null
      } finally {
        setIsExporting(null)
      }
    },
    [notifyLoadError]
  )

  const onFullDataChange = useCallback((value: boolean) => {
    setFullData(value)
  }, [])

  const onSortedByChange = useCallback((value: string | null) => {
    if (!value) {
      setSortedBy(null)
      return
    }

    setSortedBy(value as K)
  }, [])

  const onSortDirectionChange = useCallback(() => {
    setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC")
  }, [sortDirection])

  const onRowsQtyChange = useCallback((value: number) => {
    setRowsQuantity(value)
  }, [])

  const onReset = () => {
    setFullData(false)
    setSortedBy(field)
    setSortDirection(direction)
    setRowsQuantity(pageSize)
  }

  useEffect(() => {
    setRowsQuantity(pageSize)
    setSortDirection(direction)
    setSortedBy(field)
  }, [pageSize, field, direction])

  useEffect(() => {
    if (data.length > 0 && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current()
      setIsExporting(null)
    }
  }, [data])

  const reportName = t(reportNameKey)
  const reportColumns = (Object.keys(columnLabelKeys) as C[]).map((id) => ({
    id,
    label: t(columnLabelKeys[id]),
  }))

  // Props de <ExportActionsDialog />, iguales en todas las exportaciones salvo los manejadores.
  const dialogProps = ({ onPDF, onXLSX, onOpenChange }: DialogHandlers) => ({
    actions: {
      PDF: {
        onClick: onPDF,
        isLoading: isExporting === "PDF",
        disabled: !!isExporting,
      },
      XLSX: {
        onClick: onXLSX,
        isLoading: isExporting === "XLSX",
        disabled: !!isExporting,
      },
    },
    description: t("export.description"),
    options: {
      fullData: { value: fullData, onChange: onFullDataChange },
      rowsQuantity: { value: rowsQuantity, onChange: onRowsQtyChange },
      sorting: {
        items: Object.fromEntries(
          reportColumns.map(({ id, label }) => [id, { label, value: id }])
        ),
        onSortDirectionChange,
        onSortedByChange,
        sortedBy,
        sortDirection,
      },
    },
    title: t("export.title"),
    onOpenChange,
  })

  return {
    contentRef,
    promiseResolveRef,
    fullData,
    isExporting,
    rowsQuantity,
    sortedBy,
    sortDirection,
    loadBeforePrint,
    loadForXlsx,
    onFullDataChange,
    onSortedByChange,
    onSortDirectionChange,
    onRowsQtyChange,
    onReset,
    reportName,
    reportColumns,
    dialogProps,
  }
}
