import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, screen } from "@testing-library/react"
import type { Transfer } from "@/app/actions/transfers"
import {
  es,
  lastPushedParams,
  meta,
  renderWithProviders,
} from "@/test/table-test-utils"
import { TransfersTable } from "./transfers-table"

const push = vi.fn()
let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}))
vi.mock("@/components/filters/transfers-filters", () => ({
  TransfersFilters: () => null,
}))
vi.mock("./transfers-row-actions", () => ({
  TransfersRowActions: () => null,
}))

const BASE_PATH = "/dashboard/transfers"

function transfer(id: string, updatedAt = "2026-10-16T00:00:00Z"): Transfer {
  return {
    id,
    amountCents: 1500,
    description: `desc-${id}`,
    transferDate: "2026-10-16",
    fromAccountId: "a",
    toAccountId: "b",
    fromAccount: { id: "a", name: `origen-${id}` },
    toAccount: { id: "b", name: `destino-${id}` },
    createdAt: "",
    updatedAt,
    isActive: true,
  }
}

function renderTable(transfers: Transfer[], totalPages = 50) {
  renderWithProviders(
    <TransfersTable transfers={transfers} meta={meta(totalPages)} />
  )
}

beforeEach(() => {
  push.mockClear()
  searchParams = new URLSearchParams("page=3")
})
afterEach(cleanup)

describe("TransfersTable", () => {
  it("renderiza transferencias con paginación compacta aunque haya muchas páginas", () => {
    renderTable([transfer("1"), transfer("2", "no-es-fecha")])

    expect(screen.getByText("origen-1")).toBeTruthy()
    expect(screen.getByText("destino-1")).toBeTruthy()
    expect(screen.getByText("no-es-fecha")).toBeTruthy()
    expect(screen.getByText("Página 3 de 50")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "50" })).toBeNull()
  })

  it("muestra el estado vacío", () => {
    renderTable([], 0)

    expect(screen.getByText(es("transfers.table.empty"))).toBeTruthy()
  })

  it("cambia de página conservando los filtros", () => {
    searchParams = new URLSearchParams("page=3&search=ahorro")
    renderTable([transfer("1")])

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))

    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("page")).toBe("4")
    expect(params.get("search")).toBe("ahorro")
  })

  it("busca y vuelve a la página 1; vaciar la búsqueda quita el parámetro", () => {
    renderTable([transfer("1")])
    const input = screen.getByPlaceholderText(
      es("transfers.search.placeholder")
    )

    fireEvent.change(input, { target: { value: "ahorro" } })
    expect(lastPushedParams(push, BASE_PATH).get("search")).toBe("ahorro")
    expect(lastPushedParams(push, BASE_PATH).get("page")).toBe("1")

    fireEvent.change(input, { target: { value: "" } })
    expect(lastPushedParams(push, BASE_PATH).has("search")).toBe(false)
  })

  it("alterna el orden por columna", () => {
    searchParams = new URLSearchParams("orderBy=amountCents&order=ASC")
    renderTable([transfer("1")])

    fireEvent.click(
      screen.getByRole("button", { name: es("transfers.table.amount") })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("DESC")

    fireEvent.click(
      screen.getByRole("button", { name: es("transfers.table.date") })
    )
    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("orderBy")).toBe("transferDate")
    expect(params.get("order")).toBe("ASC")
  })

  it("con orden descendente, volver a ordenar la misma columna pasa a ascendente", () => {
    renderTable([transfer("1")])

    fireEvent.click(
      screen.getByRole("button", { name: es("transfers.table.updatedAt") })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("ASC")
  })
})
