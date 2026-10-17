import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, screen } from "@testing-library/react"
import type { MonthlyPeriod } from "@/app/actions/monthly-periods/types"
import {
  es,
  lastPushedParams,
  meta,
  renderWithProviders,
} from "@/test/table-test-utils"
import { MonthlyPeriodsTable } from "./monthly-periods-table"

const push = vi.fn()
let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}))
vi.mock("@/components/filters/monthly-periods-filters", () => ({
  MonthlyPeriodsFilters: () => null,
}))
vi.mock("./monthly-periods-row-actions", () => ({
  MonthlyPeriodsRowActions: () => null,
}))

const BASE_PATH = "/dashboard/monthly-periods"

function period(
  id: string,
  isActive = true,
  updatedAt = "2026-10-16T00:00:00Z"
): MonthlyPeriod {
  return {
    id,
    year: 2026,
    month: 10,
    initialSavingCents: 0,
    isActive,
    createdAt: "",
    updatedAt,
  }
}

function renderTable(monthlyPeriods: MonthlyPeriod[], totalPages = 50) {
  renderWithProviders(
    <MonthlyPeriodsTable
      monthlyPeriods={monthlyPeriods}
      meta={meta(totalPages)}
    />
  )
}

beforeEach(() => {
  push.mockClear()
  searchParams = new URLSearchParams("page=3")
})
afterEach(cleanup)

describe("MonthlyPeriodsTable", () => {
  it("renderiza periodos activos e inactivos con paginación compacta", () => {
    renderTable([period("1"), period("2", false, "no-es-fecha")])

    expect(screen.getByText(es("monthlyPeriods.status.active"))).toBeTruthy()
    expect(screen.getByText(es("monthlyPeriods.status.inactive"))).toBeTruthy()
    expect(screen.getByText("no-es-fecha")).toBeTruthy()
    expect(screen.getByText("Página 3 de 50")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "50" })).toBeNull()
  })

  it("muestra el estado vacío", () => {
    renderTable([], 0)

    expect(screen.getByText(es("monthlyPeriods.table.empty"))).toBeTruthy()
  })

  it("cambia de página conservando los filtros", () => {
    searchParams = new URLSearchParams("page=3&search=2026")
    renderTable([period("1")])

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))

    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("page")).toBe("4")
    expect(params.get("search")).toBe("2026")
  })

  it("busca y vuelve a la página 1; vaciar la búsqueda quita el parámetro", () => {
    renderTable([period("1")])
    const input = screen.getByPlaceholderText(
      es("monthlyPeriods.search.placeholder")
    )

    fireEvent.change(input, { target: { value: "2026" } })
    expect(lastPushedParams(push, BASE_PATH).get("search")).toBe("2026")
    expect(lastPushedParams(push, BASE_PATH).get("page")).toBe("1")

    fireEvent.change(input, { target: { value: "" } })
    expect(lastPushedParams(push, BASE_PATH).has("search")).toBe(false)
  })

  it("alterna el orden por columna", () => {
    searchParams = new URLSearchParams("orderBy=year&order=ASC")
    renderTable([period("1")])

    fireEvent.click(
      screen.getByRole("button", { name: es("monthlyPeriods.table.year") })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("DESC")

    fireEvent.click(
      screen.getByRole("button", { name: es("monthlyPeriods.table.month") })
    )
    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("orderBy")).toBe("month")
    expect(params.get("order")).toBe("ASC")
  })

  it("con orden descendente, volver a ordenar la misma columna pasa a ascendente", () => {
    renderTable([period("1")])

    fireEvent.click(
      screen.getByRole("button", {
        name: es("monthlyPeriods.table.updatedAt"),
      })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("ASC")
  })
})
