import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, screen } from "@testing-library/react"
import type { User } from "@/app/actions/users/types"
import {
  lastPushedParams as pushedParams,
  meta,
  renderWithProviders,
} from "@/test/table-test-utils"
import { AdminUsersTable } from "./admin-users-table"

const push = vi.fn()
let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}))
vi.mock("./admin-users-row-actions", () => ({
  AdminUsersRowActions: () => null,
}))

function user(id: string, overrides: Partial<User> = {}): User {
  return {
    id,
    email: `user-${id}@mail.com`,
    username: `user-${id}`,
    role: "ADMIN",
    preferredCurrency: "GTQ",
    timeZone: "AMERICA_GUATEMALA",
    preferredLanguage: "ES",
    isActive: true,
    emailVerifiedAt: null,
    createdAt: "2026-10-16T00:00:00Z",
    updatedAt: "2026-10-16T00:00:00Z",
    ...overrides,
  }
}

function renderTable(users: User[], totalPages = 50) {
  renderWithProviders(<AdminUsersTable users={users} meta={meta(totalPages)} />)
}

const lastPushedParams = () => pushedParams(push, "/dashboard/admin/users")

beforeEach(() => {
  push.mockClear()
  searchParams = new URLSearchParams("page=3")
})
afterEach(cleanup)

describe("AdminUsersTable", () => {
  it("renderiza usuarios con paginación compacta aunque haya muchas páginas", () => {
    renderTable([
      user("1"),
      user("2", {
        role: "UNKNOWN" as User["role"],
        isActive: false,
        emailVerifiedAt: "no-es-fecha",
      }),
    ])

    expect(screen.getByText("user-1@mail.com")).toBeTruthy()
    expect(screen.getByText("Administrador")).toBeTruthy()
    expect(screen.getByText("No verificado")).toBeTruthy()
    expect(screen.getByText("no-es-fecha")).toBeTruthy()
    expect(screen.getByText("✓")).toBeTruthy()
    expect(screen.getByText("—")).toBeTruthy()
    expect(screen.getByText("Página 3 de 50")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "50" })).toBeNull()
  })

  it("muestra el estado vacío", () => {
    renderTable([], 0)

    expect(screen.getByText("No hay usuarios que coincidan.")).toBeTruthy()
  })

  it("cambia de página conservando los filtros", () => {
    searchParams = new URLSearchParams("page=3&search=ana")
    renderTable([user("1")])

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))

    const params = lastPushedParams()
    expect(params.get("page")).toBe("4")
    expect(params.get("search")).toBe("ana")
  })

  it("busca y vuelve a la página 1; vaciar la búsqueda quita el parámetro", () => {
    renderTable([user("1")])
    const input = screen.getByPlaceholderText("Buscar por usuario o correo…")

    fireEvent.change(input, { target: { value: "ana" } })
    expect(lastPushedParams().get("search")).toBe("ana")
    expect(lastPushedParams().get("page")).toBe("1")

    fireEvent.change(input, { target: { value: "" } })
    expect(lastPushedParams().has("search")).toBe(false)
  })

  it("alterna el orden por columna", () => {
    searchParams = new URLSearchParams("orderBy=email&order=ASC&limit=15")
    renderTable([user("1")])

    fireEvent.click(screen.getByRole("button", { name: "Correo" }))
    expect(lastPushedParams().get("order")).toBe("DESC")

    fireEvent.click(screen.getByRole("button", { name: "Rol" }))
    expect(lastPushedParams().get("orderBy")).toBe("role")
    expect(lastPushedParams().get("order")).toBe("ASC")
  })

  it("con orden descendente, volver a ordenar la misma columna pasa a ascendente", () => {
    searchParams = new URLSearchParams("orderBy=email&order=desc")
    renderTable([user("1")])

    fireEvent.click(screen.getByRole("button", { name: "Correo" }))
    expect(lastPushedParams().get("order")).toBe("ASC")
  })
})
