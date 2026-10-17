import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, screen } from "@testing-library/react"
import type { Transaction } from "@/app/actions/transactions/types"
import {
  es,
  lastPushedParams,
  meta,
  renderWithProviders,
} from "@/test/table-test-utils"
import { TransactionsTable } from "./transactions-table"

const push = vi.fn()
let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}))
vi.mock("@/components/filters/transactions-filters", () => ({
  TransactionsFilters: () => null,
}))
vi.mock("./transactions-row-actions", () => ({
  TransactionsRowActions: () => null,
}))

const BASE_PATH = "/dashboard/transactions/expenses"

function transaction(id: string): Transaction {
  return {
    id,
    amountCents: 1500,
    description: `desc-${id}`,
    transactionDate: "2026-10-16",
    createdAt: "",
    updatedAt: "",
    category: {
      id: `cat-${id}`,
      name: `categoria-${id}`,
      categoryType: "EXPENSE",
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
  }
}

function renderTable(transactions: Transaction[], totalPages = 50) {
  renderWithProviders(
    <TransactionsTable
      transactions={transactions}
      meta={meta(totalPages)}
      categoryType="EXPENSE"
      basePath={BASE_PATH}
    />
  )
}

beforeEach(() => {
  push.mockClear()
  searchParams = new URLSearchParams("page=3")
})
afterEach(cleanup)

describe("TransactionsTable", () => {
  it("renderiza transacciones con paginación compacta aunque haya muchas páginas", () => {
    renderTable([transaction("1")])

    expect(screen.getByText("desc-1")).toBeTruthy()
    expect(screen.getByText("categoria-1")).toBeTruthy()
    expect(screen.getByText("cuenta-1")).toBeTruthy()
    expect(screen.getByText("Página 3 de 50")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "50" })).toBeNull()
  })

  it("muestra el estado vacío", () => {
    renderTable([], 0)

    expect(screen.getByText(es("transactions.table.empty"))).toBeTruthy()
  })

  it("cambia de página conservando los filtros", () => {
    searchParams = new URLSearchParams("page=3&search=cafe")
    renderTable([transaction("1")])

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))

    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("page")).toBe("4")
    expect(params.get("search")).toBe("cafe")
  })

  it("busca y vuelve a la página 1; vaciar la búsqueda quita el parámetro", () => {
    renderTable([transaction("1")])
    const input = screen.getByPlaceholderText(
      es("transactions.search.byDescription")
    )

    fireEvent.change(input, { target: { value: "cafe" } })
    expect(lastPushedParams(push, BASE_PATH).get("search")).toBe("cafe")
    expect(lastPushedParams(push, BASE_PATH).get("page")).toBe("1")

    fireEvent.change(input, { target: { value: "" } })
    expect(lastPushedParams(push, BASE_PATH).has("search")).toBe(false)
  })

  it("alterna el orden por columna", () => {
    searchParams = new URLSearchParams("orderBy=amountCents&order=ASC")
    renderTable([transaction("1")])

    fireEvent.click(
      screen.getByRole("button", { name: es("transactions.table.amount") })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("DESC")

    fireEvent.click(
      screen.getByRole("button", {
        name: es("transactions.table.transactionDate"),
      })
    )
    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("orderBy")).toBe("transactionDate")
    expect(params.get("order")).toBe("ASC")
  })

  it("con orden descendente, volver a ordenar la misma columna pasa a ascendente", () => {
    searchParams = new URLSearchParams("orderBy=amountCents&order=DESC")
    renderTable([transaction("1")])

    fireEvent.click(
      screen.getByRole("button", { name: es("transactions.table.amount") })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("ASC")
  })
})
