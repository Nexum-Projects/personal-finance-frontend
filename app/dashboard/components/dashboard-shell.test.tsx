import { cleanup, fireEvent, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { es, renderWithProviders } from "@/test/table-test-utils"
import { DashboardShell } from "./dashboard-shell"

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }))
vi.mock("@/components/dashboard/Sidebar", () => ({
  Sidebar: () => <a href="/dashboard">inicio</a>,
}))
vi.mock("@/components/dashboard/AdminSidebar", () => ({
  AdminSidebar: () => null,
}))

const preferences = {
  preferredCurrency: "GTQ",
  timeZone: "AMERICA_GUATEMALA",
  preferredLanguage: "ES",
} as const

const menuButton = () => screen.getByRole("button", { name: es("nav.menu") })

function renderOpenShell() {
  renderWithProviders(
    <DashboardShell preferences={preferences}>contenido</DashboardShell>
  )
  fireEvent.click(menuButton())
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

  it("el botón del menú indica si está abierto y el menú cerrado queda fuera del orden de tabulación", () => {
    renderWithProviders(
      <DashboardShell preferences={preferences}>contenido</DashboardShell>
    )
    const aside = document.getElementById("dashboard-sidebar")!

    expect(menuButton().getAttribute("aria-expanded")).toBe("false")
    expect(menuButton().getAttribute("aria-controls")).toBe("dashboard-sidebar")
    expect(aside.classList).toContain("invisible")
    expect(aside.classList).toContain("lg:visible")

    fireEvent.click(menuButton())

    expect(menuButton().getAttribute("aria-expanded")).toBe("true")
    expect(aside.classList).not.toContain("invisible")
  })

  it("lleva el foco al menú al abrirlo y lo devuelve al botón al cerrarlo", () => {
    renderOpenShell()
    expect(document.activeElement).toBe(
      screen.getByRole("link", { name: "inicio" })
    )

    fireEvent.keyDown(window, { key: "Escape" })

    expect(document.activeElement).toBe(menuButton())
  })

  it("no mueve el foco al montar con el menú cerrado", () => {
    renderWithProviders(
      <DashboardShell preferences={preferences}>contenido</DashboardShell>
    )

    expect(document.activeElement).toBe(document.body)
  })
})
