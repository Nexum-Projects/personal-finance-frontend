"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useI18n } from "@/components/i18n/i18n-provider"

export type ExportType = "PDF" | "XLSX"

type SortDirection = "ASC" | "DESC"

// El efecto que resuelve la carga solo dispara con filas: sin ellas la exportación quedaría colgada.
const NO_DATA_ERROR = new Error("No data to export")

type Params<K extends string, T> = {
  data: T[]
  pageSize: number
  sort: {
    direction: SortDirection
    field: K | null
  }
}

export function useExportAction<K extends string, T>({
  data,
  pageSize,
  sort: { direction, field },
}: Params<K, T>) {
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

  const onIsExportingChange = useCallback((value: ExportType | null) => {
    setIsExporting(value)
  }, [])

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
        toast.error(
          t(error === NO_DATA_ERROR ? "export.noData" : "export.loadError")
        )
        throw error
      }
    },
    [t]
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

  return {
    contentRef,
    promiseResolveRef,
    fullData,
    isExporting,
    rowsQuantity,
    sortedBy,
    sortDirection,
    onIsExportingChange,
    loadBeforePrint,
    onFullDataChange,
    onSortedByChange,
    onSortDirectionChange,
    onRowsQtyChange,
    onReset,
  }
}
