import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { toast } from "sonner"
import { render } from "@testing-library/react"
import { es, meta, renderWithProviders } from "@/test/table-test-utils"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { UserPreferencesProvider } from "@/components/preferences/user-preferences-provider"
import { EN_MESSAGES } from "@/utils/i18n/messages"
import { findManyAccounts } from "@/app/actions/accounts"
import { findManyTransactions } from "@/app/actions/transactions"
import { exportXLSX } from "@/utils/helpers/export-xlsx"
import { AccountsExportAction } from "./accounts/components/accounts-export-action"
import { TransactionsExportAction } from "./transactions/components/transactions-export-action"

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }))
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}))
vi.mock("react-to-print", () => ({ useReactToPrint: () => vi.fn() }))
vi.mock("@/components/display/page-print", () => ({
  PagePrint: ({
    title,
    columns,
  }: {
    title: string
    columns: { label: string }[]
  }) => (
    <p data-testid="print">
      {[title, ...columns.map((column) => column.label)].join("|")}
    </p>
  ),
}))
vi.mock("@/utils/helpers/export-xlsx", () => ({ exportXLSX: vi.fn() }))
vi.mock("@/app/actions/accounts", () => ({ findManyAccounts: vi.fn() }))
vi.mock("@/app/actions/transactions", () => ({ findManyTransactions: vi.fn() }))
// El diálogo real solo envuelve los botones; aquí se exponen el de Excel y el de "todos los datos".
vi.mock("@/components/display/export-actions-dialog", () => ({
  ExportActionsDialog: ({
    actions,
    options,
  }: {
    actions: { XLSX: { onClick: () => void } }
    options: {
      fullData: { onChange: (value: boolean) => void }
      sorting: { items: Record<string, { label: string }> }
    }
  }) => (
    <>
      <button onClick={() => options.fullData.onChange(true)}>todo</button>
      <button onClick={actions.XLSX.onClick}>excel</button>
      <p data-testid="sort-options">
        {Object.values(options.sorting.items)
          .map((item) => item.label)
          .join("|")}
      </p>
    </>
  ),
}))

const ACCOUNT = {
  id: "a1",
  name: "Banco",
  accountType: "SAVINGS",
  currentBalanceCents: 1000,
  currency: "GTQ",
  updatedAt: "2026-10-17T06:03:00.000Z",
}
const TRANSACTION = {
  id: "t1",
  amountCents: 500,
  description: "Café",
  transactionDate: "2026-10-17",
  category: { name: "Comida", categoryType: "EXPENSE" },
  account: { name: "Banco" },
}
const apiError = {
  status: "error",
  errors: [{ title: "Error", message: "boom" }],
}
const page = (data: unknown[], totalPages = 1) => ({
  status: "success",
  data: { data, meta: meta(totalPages) },
})

const cases = [
  {
    name: "AccountsExportAction",
    Component: AccountsExportAction,
    findMany: vi.mocked(findManyAccounts),
    row: ACCOUNT,
    en: {
      report: "Accounts Report",
      labels: ["Name", "Type", "Balance", "Currency", "Last update"],
    },
  },
  {
    name: "TransactionsExportAction",
    Component: TransactionsExportAction,
    findMany: vi.mocked(findManyTransactions),
    row: TRANSACTION,
    en: {
      report: "Transactions Report",
      labels: ["Amount", "Description", "Category", "Account", "Type", "Date"],
    },
  },
]

beforeEach(() => vi.clearAllMocks())
afterEach(cleanup)

describe.each(cases)(
  "$name — exportación a Excel",
  ({ Component, findMany, row }) => {
    const clickExcel = () => {
      renderWithProviders(<Component />)
      fireEvent.click(screen.getByRole("button", { name: "excel" }))
    }

    it("exporta las filas cargadas", async () => {
      findMany.mockResolvedValue(page([row]) as never)

      clickExcel()

      await waitFor(() => expect(exportXLSX).toHaveBeenCalledOnce())
      expect(vi.mocked(exportXLSX).mock.calls[0][0].rows).toHaveLength(1)
      expect(toast.error).not.toHaveBeenCalled()
    })

    it("no descarga nada y avisa si no hay filas", async () => {
      findMany.mockResolvedValue(page([]) as never)

      clickExcel()

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(es("export.noData"))
      )
      expect(exportXLSX).not.toHaveBeenCalled()
    })

    it("no descarga nada y avisa si el API responde con error", async () => {
      findMany.mockResolvedValue(apiError as never)

      clickExcel()

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(es("export.loadError"))
      )
      expect(exportXLSX).not.toHaveBeenCalled()
    })

    it("con todos los datos, un error en una página cancela en lugar de exportar a medias", async () => {
      findMany
        .mockResolvedValueOnce(page([row], 2) as never)
        .mockResolvedValueOnce(apiError as never)

      renderWithProviders(<Component />)
      fireEvent.click(screen.getByRole("button", { name: "todo" }))
      fireEvent.click(screen.getByRole("button", { name: "excel" }))

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(es("export.loadError"))
      )
      expect(findMany).toHaveBeenCalledTimes(2)
      expect(exportXLSX).not.toHaveBeenCalled()
    })
  }
)

describe.each(cases)(
  "$name — idioma del usuario",
  ({ Component, findMany, row, en }) => {
    it("exporta con encabezados y nombre del reporte en inglés", async () => {
      findMany.mockResolvedValue(page([row]) as never)
      render(
        <I18nProvider language="EN" messages={EN_MESSAGES}>
          <UserPreferencesProvider
            preferences={{
              preferredCurrency: "GTQ",
              timeZone: "AMERICA_GUATEMALA",
              preferredLanguage: "EN",
            }}
          >
            <Component />
          </UserPreferencesProvider>
        </I18nProvider>
      )

      expect(screen.getByTestId("sort-options").textContent).toBe(
        en.labels.join("|")
      )
      expect(screen.getByTestId("print").textContent).toBe(
        [en.report, ...en.labels].join("|")
      )

      fireEvent.click(screen.getByRole("button", { name: "excel" }))
      await waitFor(() => expect(exportXLSX).toHaveBeenCalledOnce())
      const { documentName, columns } = vi.mocked(exportXLSX).mock.calls[0][0]
      expect(documentName).toBe(en.report)
      expect(columns.map((column) => column.label)).toEqual(en.labels)
    })
  }
)
