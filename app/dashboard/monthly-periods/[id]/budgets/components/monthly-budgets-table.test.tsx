import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, screen } from "@testing-library/react"
import type { MonthlyBudget } from "@/app/actions/monthly-budgets/types"
import {
  es,
  lastPushedParams,
  meta,
  renderWithProviders,
} from "@/test/table-test-utils"
import { MonthlyBudgetsTable } from "./monthly-budgets-table"

const push = vi.fn()
let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}))
vi.mock("./monthly-budgets-row-actions", () => ({
  MonthlyBudgetsRowActions: () => null,
}))

const BASE_PATH = "/dashboard/monthly-periods/periodo-1/budgets"

function budget(
  id: string,
  isActive = true,
  updatedAt = "2026-10-16T00:00:00Z"
): MonthlyBudget {
  return {
    id,
    budgetedCents: 1500,
    isActive,
    createdAt: "",
    updatedAt,
    monthlyPeriod: { id: "periodo-1", year: 2026, month: 10 },
    category: {
      id: `cat-${id}`,
      name: `categoria-${id}`,
      categoryType: "EXPENSE",
      createdAt: "",
      updatedAt: "",
      isActive: true,
    },
  }
}

function renderTable(budgets: MonthlyBudget[], totalPages = 50) {
  renderWithProviders(
    <MonthlyBudgetsTable
      monthlyPeriodId="periodo-1"
      budgets={budgets}
      meta={meta(totalPages)}
    />
  )
}

beforeEach(() => {
  push.mockClear()
  searchParams = new URLSearchParams("page=3")
})
afterEach(cleanup)

describe("MonthlyBudgetsTable", () => {
  it("renderiza presupuestos activos e inactivos con paginación compacta", () => {
    renderTable([budget("1"), budget("2", false, "no-es-fecha")])

    expect(screen.getByText("categoria-1")).toBeTruthy()
    expect(
      screen.getByText(es("monthlyPeriods.budgets.status.active"))
    ).toBeTruthy()
    expect(
      screen.getByText(es("monthlyPeriods.budgets.status.inactive"))
    ).toBeTruthy()
    expect(screen.getByText("no-es-fecha")).toBeTruthy()
    expect(screen.getByText("Página 3 de 50")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "50" })).toBeNull()
  })

  it("muestra el estado vacío", () => {
    renderTable([], 0)

    expect(
      screen.getByText(es("monthlyPeriods.budgets.table.empty"))
    ).toBeTruthy()
  })

  it("cambia de página conservando los filtros", () => {
    searchParams = new URLSearchParams("page=3&search=comida")
    renderTable([budget("1")])

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))

    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("page")).toBe("4")
    expect(params.get("search")).toBe("comida")
  })

  it("busca y vuelve a la página 1; vaciar la búsqueda quita el parámetro", () => {
    renderTable([budget("1")])
    const input = screen.getByPlaceholderText(
      es("monthlyPeriods.budgets.search.placeholder")
    )

    fireEvent.change(input, { target: { value: "comida" } })
    expect(lastPushedParams(push, BASE_PATH).get("search")).toBe("comida")
    expect(lastPushedParams(push, BASE_PATH).get("page")).toBe("1")

    fireEvent.change(input, { target: { value: "" } })
    expect(lastPushedParams(push, BASE_PATH).has("search")).toBe(false)
  })

  it("alterna el orden por columna", () => {
    searchParams = new URLSearchParams("orderBy=budgetedCents&order=ASC")
    renderTable([budget("1")])

    fireEvent.click(
      screen.getByRole("button", {
        name: es("monthlyPeriods.budgets.table.budgeted"),
      })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("DESC")

    fireEvent.click(
      screen.getByRole("button", {
        name: es("monthlyPeriods.budgets.table.updatedAt"),
      })
    )
    const params = lastPushedParams(push, BASE_PATH)
    expect(params.get("orderBy")).toBe("updatedAt")
    expect(params.get("order")).toBe("ASC")
  })

  it("con orden descendente, volver a ordenar la misma columna pasa a ascendente", () => {
    renderTable([budget("1")])

    fireEvent.click(
      screen.getByRole("button", {
        name: es("monthlyPeriods.budgets.table.updatedAt"),
      })
    )
    expect(lastPushedParams(push, BASE_PATH).get("order")).toBe("ASC")
  })
})
