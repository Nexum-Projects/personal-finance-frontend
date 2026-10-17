import { cleanup, fireEvent, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { es, renderWithProviders } from "@/test/table-test-utils"
import { DashboardShell } from "./dashboard-shell"

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }))
vi.mock("@/components/dashboard/Sidebar", () => ({ Sidebar: () => null }))
vi.mock("@/components/dashboard/AdminSidebar", () => ({
  AdminSidebar: () => null,
}))

const preferences = {
  preferredCurrency: "GTQ",
  timeZone: "AMERICA_GUATEMALA",
  preferredLanguage: "ES",
} as const

function renderOpenShell() {
  renderWithProviders(
    <DashboardShell preferences={preferences}>contenido</DashboardShell>
  )
  fireEvent.click(screen.getByRole("button"))
  return () => screen.queryByRole("button", { name: es("common.close") })
}

afterEach(cleanup)

describe("DashboardShell", () => {
  it("el fondo del menú móvil es un botón accesible que lo cierra", () => {
    const overlay = renderOpenShell()

    fireEvent.click(overlay()!)

    expect(overlay()).toBeNull()
  })

  it("cierra el menú móvil con Escape", () => {
    const overlay = renderOpenShell()
    expect(overlay()).not.toBeNull()

    fireEvent.keyDown(window, { key: "Enter" })
    expect(overlay()).not.toBeNull()

    fireEvent.keyDown(window, { key: "Escape" })
    expect(overlay()).toBeNull()
  })
})
