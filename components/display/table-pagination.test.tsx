import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { ES_MESSAGES } from "@/utils/i18n/messages"
import { TablePagination } from "./table-pagination"

afterEach(cleanup)

function renderPagination(
  props: Partial<Parameters<typeof TablePagination>[0]> = {}
) {
  const onPageChange = vi.fn()
  render(
    <I18nProvider language="ES" messages={ES_MESSAGES}>
      <TablePagination
        currentPage={2}
        totalPages={40}
        limit={10}
        totalObjects={395}
        itemCount={10}
        entity="transacciones"
        onPageChange={onPageChange}
        {...props}
      />
    </I18nProvider>
  )
  return onPageChange
}

describe("TablePagination", () => {
  it("muestra el rango y la página actual sin un botón por página", () => {
    renderPagination()

    expect(
      screen.getByText("Mostrando 11 a 20 de 395 transacciones")
    ).toBeTruthy()
    expect(screen.getByText("Página 2 de 40")).toBeTruthy()
    expect(screen.getAllByRole("button")).toHaveLength(2)
  })

  it("navega a la página anterior y siguiente", () => {
    const onPageChange = renderPagination()

    fireEvent.click(screen.getByRole("button", { name: "Anterior" }))
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))

    expect(onPageChange.mock.calls).toEqual([[1], [3]])
  })

  it("deshabilita los extremos y muestra 0 sin resultados", () => {
    renderPagination({
      currentPage: 1,
      totalPages: 0,
      totalObjects: 0,
      itemCount: 0,
    })

    expect(screen.getByText("Mostrando 0 a 0 de 0 transacciones")).toBeTruthy()
    for (const button of screen.getAllByRole("button")) {
      expect((button as HTMLButtonElement).disabled).toBe(true)
    }
  })

  it("deshabilita la navegación mientras hay una transición pendiente", () => {
    renderPagination({ disabled: true })

    for (const button of screen.getAllByRole("button")) {
      expect((button as HTMLButtonElement).disabled).toBe(true)
    }
  })
})
