import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { UserPreferencesProvider } from "@/components/preferences/user-preferences-provider"
import { ES_MESSAGES } from "@/utils/i18n/messages"
import type { Transaction } from "@/app/actions/transactions/types"
import { AllTransactionsTable } from "./all-transactions-table"

const push = vi.fn()
let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}))
vi.mock("@/components/filters/transactions-filters", () => ({
  TransactionsFilters: () => null,
}))
vi.mock("./transactions-export-action", () => ({
  TransactionsExportAction: () => null,
}))
vi.mock("../../expenses/components/transactions-row-actions", () => ({
  TransactionsRowActions: () => null,
}))

function transaction(id: string, categoryType: "INCOME" | "EXPENSE") {
  return {
    id,
    amountCents: 1500,
    description: `desc-${id}`,
    transactionDate: "2026-10-16",
    createdAt: "2026-10-16T00:00:00Z",
    updatedAt: "2026-10-16T00:00:00Z",
    category: {
      id: `cat-${id}`,
      name: `categoria-${id}`,
      categoryType,
      createdAt: "",
      updatedAt: "",
    },
    account: {
      id: `acc-${id}`,
      name: `cuenta-${id}`,
      accountType: "BANK",
      currentBalanceCents: 0,
      currency: "GTQ",
      createdAt: "",
      updatedAt: "",
    },
  } satisfies Transaction
}

function renderTable(transactions: Transaction[], totalPages = 50) {
  render(
    <I18nProvider language="ES" messages={ES_MESSAGES}>
      <UserPreferencesProvider
        preferences={{
          preferredCurrency: "GTQ",
          timeZone: "AMERICA_GUATEMALA",
          preferredLanguage: "ES",
        }}
      >
        <AllTransactionsTable
          transactions={transactions}
          meta={{
            page: 1,
            limit: 10,
            totalObjects: totalPages * 10,
            totalPages,
          }}
          basePath="/dashboard/transactions"
        />
      </UserPreferencesProvider>
    </I18nProvider>
  )
}

function lastPushedParams() {
  const url: string = push.mock.calls.at(-1)?.[0]
  return new URLSearchParams(url.split("?")[1])
}

beforeEach(() => {
  push.mockClear()
  searchParams = new URLSearchParams("page=3")
})
afterEach(cleanup)

describe("AllTransactionsTable", () => {
  it("renderiza ingresos y gastos con paginación compacta aunque haya muchas páginas", () => {
    renderTable([transaction("1", "INCOME"), transaction("2", "EXPENSE")])

    expect(screen.getByText("desc-1")).toBeTruthy()
    expect(screen.getByText("Ingreso")).toBeTruthy()
    expect(screen.getByText("Gasto")).toBeTruthy()
    expect(screen.getByText("Página 3 de 50")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "50" })).toBeNull()
  })

  it("muestra el estado vacío", () => {
    renderTable([], 0)

    expect(screen.getByText("No se encontraron transacciones")).toBeTruthy()
  })

  it("cambia de página conservando los filtros", () => {
    searchParams = new URLSearchParams("page=3&search=cafe")
    renderTable([transaction("1", "EXPENSE")])

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))

    const params = lastPushedParams()
    expect(params.get("page")).toBe("4")
    expect(params.get("search")).toBe("cafe")
  })

  it("busca y vuelve a la página 1; vaciar la búsqueda quita el parámetro", () => {
    renderTable([transaction("1", "EXPENSE")])
    const input = screen.getByPlaceholderText("Buscar transacciones...")

    fireEvent.change(input, { target: { value: "cafe" } })
    expect(lastPushedParams().get("search")).toBe("cafe")
    expect(lastPushedParams().get("page")).toBe("1")

    fireEvent.change(input, { target: { value: "" } })
    expect(lastPushedParams().has("search")).toBe(false)
  })

  it("alterna el orden por monto y por fecha", () => {
    searchParams = new URLSearchParams("orderBy=amountCents&order=ASC")
    renderTable([transaction("1", "EXPENSE")])

    fireEvent.click(screen.getByRole("button", { name: "Monto" }))
    expect(lastPushedParams().get("order")).toBe("DESC")

    fireEvent.click(screen.getByRole("button", { name: "Fecha" }))
    expect(lastPushedParams().get("orderBy")).toBe("transactionDate")
    expect(lastPushedParams().get("order")).toBe("ASC")
  })

  it("muestra el icono de orden descendente", () => {
    searchParams = new URLSearchParams("orderBy=amountCents&order=DESC")
    renderTable([transaction("1", "EXPENSE")])

    fireEvent.click(screen.getByRole("button", { name: "Monto" }))
    expect(lastPushedParams().get("order")).toBe("ASC")
  })
})
