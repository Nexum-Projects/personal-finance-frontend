import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, screen } from "@testing-library/react"
import type { Category } from "@/app/actions/categories/types"
import {
  es,
  lastPushedParams,
  meta,
  renderWithProviders,
} from "@/test/table-test-utils"
import { CategoriesTable } from "./categories-table"

const push = vi.fn()
let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}))
vi.mock("@/components/filters/categories-filters", () => ({
  CategoriesFilters: () => null,
}))
vi.mock("./categories-row-actions", () => ({
  CategoriesRowActions: () => null,
}))

const BASE_PATH = "/dashboard/categories"

function category(id: string): Category {
  return {
    id,
    name: `categoria-${id}`,
    categoryType: "EXPENSE",
    createdAt: "",
    updatedAt: "2026-10-16T12:30:00",
    isActive: true,
  }
}

function renderTable(categories: Category[], totalPages = 50) {
  renderWithProviders(
    <CategoriesTable categories={categories} meta={meta(totalPages)} />
  )
}

beforeEach(() => {
  push.mockClear()
  searchParams = new URLSearchParams("page=3")
})
afterEach(cleanup)

describe("CategoriesTable", () => {
  it("renderiza categorías con paginación compacta aunque haya muchas páginas", () => {
    renderTable([category("1")])

    expect(screen.getByText("categoria-1")).toBeTruthy()
    expect(screen.getByText("16/10/2026 12:30")).toBeTruthy()
    expect(screen.getByText("Página 3 de 50")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "50" })).toBeNull()
  })

  it("muestra el estado vacío", () => {
    renderTable([], 0)

    expect(screen.getByText(es("categories.table.empty"))).toBeTruthy()
  })

  it("cambia de página conservando los filtros", () => {
    searchParams = new URLSearchParams("page=3&search=comida")
    renderTable([category("1")])

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))

    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("page")).toBe("4")
    expect(params.get("search")).toBe("comida")
  })

  it("busca y vuelve a la página 1; vaciar la búsqueda quita el parámetro", () => {
    renderTable([category("1")])
    const input = screen.getByPlaceholderText(
      es("categories.searchPlaceholder")
    )

    fireEvent.change(input, { target: { value: "comida" } })
    expect(lastPushedParams(push, BASE_PATH).get("search")).toBe("comida")
    expect(lastPushedParams(push, BASE_PATH).get("page")).toBe("1")

    fireEvent.change(input, { target: { value: "" } })
    expect(lastPushedParams(push, BASE_PATH).has("search")).toBe(false)
  })

  it("alterna el orden por columna", () => {
    searchParams = new URLSearchParams("orderBy=name&order=ASC")
    renderTable([category("1")])

    fireEvent.click(
      screen.getByRole("button", { name: es("categories.table.name") })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("DESC")

    fireEvent.click(
      screen.getByRole("button", { name: es("categories.table.type") })
    )
    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("orderBy")).toBe("categoryType")
    expect(params.get("order")).toBe("ASC")
  })

  it("con orden descendente, volver a ordenar la misma columna pasa a ascendente", () => {
    renderTable([category("1")])

    fireEvent.click(
      screen.getByRole("button", { name: es("categories.table.updatedAt") })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("ASC")
  })
})
