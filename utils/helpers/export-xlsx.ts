import { utils, writeFile } from "xlsx"

function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str
  }
  return str.substring(0, maxLength)
}

type Params<K extends string> = {
  columns: { id: K; label: string }[]
  documentName: string
  rows: Record<K, string>[]
}

export function exportXLSX<K extends string>({
  columns,
  rows,
  documentName,
}: Params<K>) {
  const worksheet = utils.json_to_sheet(rows)
  const workbook = utils.book_new()

  const labels = columns.map((column) => column.label)

  utils.sheet_add_aoa(worksheet, [labels], { origin: "A1" })

  const colWidths = columns.map((column) => {
    let maxWidth = Math.max(column.label.length + 1, 10)

    maxWidth = rows.reduce((w, row) => {
      const cellContent = String(row[column.id])

      return Math.max(w, cellContent.length + 1)
    }, maxWidth)

    return {
      wch: maxWidth,
    }
  })

  worksheet["!cols"] = colWidths

  utils.book_append_sheet(
    workbook,
    worksheet,
    truncateString(documentName, 31) // Excel's max sheet name length
  )

  writeFile(workbook, `${documentName}.xlsx`, { compression: true })
}
