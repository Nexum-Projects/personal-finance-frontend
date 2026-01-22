"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type ExportType = "PDF" | "XLSX"

type SortDirection = "ASC" | "DESC"

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

  const contentRef = useRef<HTMLDivElement>(null)
  const promiseResolveRef = useRef<
    ((value?: PromiseLike<void> | void) => void) | null
  >(null)

  const onIsExportingChange = useCallback((value: ExportType | null) => {
    setIsExporting(value)
  }, [])

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
    onFullDataChange,
    onSortedByChange,
    onSortDirectionChange,
    onRowsQtyChange,
    onReset,
  }
}
