"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Column<K extends string> = {
  id: K
  label: string
  align?: "left" | "center" | "right"
}

type Row<K extends string> = Record<K, string> & { id?: string }

type Props<K extends string> = {
  columns: Column<K>[]
  rows: Row<K>[]
  title: React.ReactNode
}

function PagePrintContainer({
  children,
  ...props
}: React.PropsWithChildren & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="font-sans hidden flex-col text-[10pt] print:flex print:min-h-screen print:bg-white print:text-black"
      {...props}
    >
      {children}
    </div>
  )
}

function PagePrintHeader({ title }: { title: React.ReactNode }) {
  return (
    <header className="flex flex-row items-center justify-between mb-8 print:mb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[18pt] leading-[110%] font-semibold uppercase">
          {title}
        </h1>
      </div>
    </header>
  )
}

function PagePrintTable<K extends string>({
  columns,
  rows,
}: {
  columns: Column<K>[]
  rows: Row<K>[]
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  "text-[10pt] font-semibold",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right"
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id || index}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn(
                    "text-[10pt]",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right"
                  )}
                >
                  {row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function PagePrint<K extends string>({
  title,
  columns,
  rows,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & Props<K>) {
  return (
    <PagePrintContainer {...props}>
      <PagePrintHeader title={title} />
      <PagePrintTable columns={columns} rows={rows} />
    </PagePrintContainer>
  )
}

PagePrint.Container = PagePrintContainer
PagePrint.Header = PagePrintHeader
PagePrint.Table = PagePrintTable
