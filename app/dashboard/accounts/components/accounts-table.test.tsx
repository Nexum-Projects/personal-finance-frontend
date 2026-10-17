import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, screen } from "@testing-library/react"
import type { Account } from "@/app/actions/transactions/types"
import {
  es,
  lastPushedParams,
  meta,
  renderWithProviders,
} from "@/test/table-test-utils"
import { AccountsTable } from "./accounts-table"

const push = vi.fn()
let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}))
vi.mock("@/components/filters/accounts-filters", () => ({
  AccountsFilters: () => null,
}))
vi.mock("./accounts-export-action", () => ({
  AccountsExportAction: () => null,
}))
vi.mock("./accounts-row-actions", () => ({
  AccountsRowActions: () => null,
}))

const BASE_PATH = "/dashboard/accounts"

function account(id: string, updatedAt = "2026-10-16T00:00:00Z"): Account {
  return {
    id,
    name: `cuenta-${id}`,
    accountType: "BANK",
    currentBalanceCents: 1500,
    currency: "GTQ",
    createdAt: "",
    updatedAt,
  }
}

function renderTable(accounts: Account[], totalPages = 50) {
  renderWithProviders(
    <AccountsTable accounts={accounts} meta={meta(totalPages)} />
  )
}

beforeEach(() => {
  push.mockClear()
  searchParams = new URLSearchParams("page=3")
})
afterEach(cleanup)

describe("AccountsTable", () => {
  it("renderiza cuentas con paginación compacta aunque haya muchas páginas", () => {
    renderTable([account("1"), account("2", "no-es-fecha")])

    expect(screen.getByText("cuenta-1")).toBeTruthy()
    expect(screen.getByText("no-es-fecha")).toBeTruthy()
    expect(screen.getByText("Página 3 de 50")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "50" })).toBeNull()
  })

  it("muestra el estado vacío", () => {
    renderTable([], 0)

    expect(screen.getByText(es("accounts.table.empty"))).toBeTruthy()
  })

  it("cambia de página conservando los filtros", () => {
    searchParams = new URLSearchParams("page=3&search=banco")
    renderTable([account("1")])

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))

    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("page")).toBe("4")
    expect(params.get("search")).toBe("banco")
  })

  it("busca y vuelve a la página 1; vaciar la búsqueda quita el parámetro", () => {
    renderTable([account("1")])
    const input = screen.getByPlaceholderText(es("accounts.searchPlaceholder"))

    fireEvent.change(input, { target: { value: "banco" } })
    expect(lastPushedParams(push, BASE_PATH).get("search")).toBe("banco")
    expect(lastPushedParams(push, BASE_PATH).get("page")).toBe("1")

    fireEvent.change(input, { target: { value: "" } })
    expect(lastPushedParams(push, BASE_PATH).has("search")).toBe(false)
  })

  it("alterna el orden por columna", () => {
    searchParams = new URLSearchParams("orderBy=name&order=ASC")
    renderTable([account("1")])

    fireEvent.click(
      screen.getByRole("button", { name: es("accounts.table.name") })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("DESC")

    fireEvent.click(
      screen.getByRole("button", { name: es("accounts.table.balance") })
    )
    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("orderBy")).toBe("currentBalanceCents")
    expect(params.get("order")).toBe("ASC")
  })

  it("con orden descendente, volver a ordenar la misma columna pasa a ascendente", () => {
    renderTable([account("1")])

    fireEvent.click(
      screen.getByRole("button", { name: es("accounts.table.updatedAt") })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("ASC")
  })
})
