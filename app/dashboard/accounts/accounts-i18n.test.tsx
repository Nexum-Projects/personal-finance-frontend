import type { ReactNode } from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { toast } from "sonner"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { EN_MESSAGES } from "@/utils/i18n/messages"
import {
  createAccount,
  findAccount,
  removeAccount,
  updateAccount,
} from "@/app/actions/accounts"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import { NewAccountForm } from "./components/new-account-form"
import { AccountsRowActions } from "./components/accounts-row-actions"
import { EditAccountForm } from "./[id]/components/edit-account-form"
import { DetailAccountActions } from "./[id]/components/detail-account-actions"
import EditAccountPage, { generateMetadata } from "./[id]/edit/page"

// Sesión en inglés para la página de servidor (getServerI18n).
vi.mock("@/app/actions/auth/getSession", () => ({
  default: async () => ({ preferredLanguage: "EN" }),
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND")
  },
}))
vi.mock("@/app/actions/accounts", () => ({
  createAccount: vi.fn(),
  updateAccount: vi.fn(),
  removeAccount: vi.fn(),
  findAccount: vi.fn(),
}))
// El formulario real (react-hook-form) no es lo que se prueba: se envía directamente.
vi.mock("./components/account-form", () => ({
  AccountForm: ({ onSubmit }: { onSubmit: (values: unknown) => void }) => (
    <button onClick={() => onSubmit({ name: "Bank" })}>save</button>
  ),
}))
// El menú desplegable real necesita interacción de Radix; aquí cada opción es un botón.
vi.mock("@/components/dashboard/data-table-row-actions", () => {
  function DataTableRowActions({ children }: { children: ReactNode }) {
    return <>{children}</>
  }
  function Item({
    children,
    onClick,
  }: {
    children: ReactNode
    onClick?: () => void
  }) {
    return <button onClick={onClick}>{children}</button>
  }
  function Separator() {
    return null
  }
  return {
    DataTableRowActions: Object.assign(DataTableRowActions, {
      Item,
      Separator,
    }),
  }
})

const account = { id: "a1", name: "Bank" } as never
const ok = (data: unknown) => ({ status: "success", data }) as never

function renderEn(ui: ReactNode) {
  return render(
    <I18nProvider language="EN" messages={EN_MESSAGES}>
      {ui}
    </I18nProvider>
  )
}

beforeEach(() => vi.clearAllMocks())
afterEach(cleanup)

describe("Cuentas en inglés", () => {
  it("avisa de la cuenta creada", async () => {
    vi.mocked(createAccount).mockResolvedValue(ok({ name: "Bank" }))
    renderEn(<NewAccountForm backToHref="/dashboard/accounts" />)

    fireEvent.click(screen.getByRole("button", { name: "save" }))

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Account created", {
        description: "Account Bank was created successfully.",
      })
    )
  })

  it("avisa de la cuenta actualizada", async () => {
    vi.mocked(updateAccount).mockResolvedValue(ok({ name: "Bank" }))
    renderEn(
      <EditAccountForm account={account} backToHref="/dashboard/accounts" />
    )

    fireEvent.click(screen.getByRole("button", { name: "save" }))

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Account updated", {
        description: "The account was updated successfully.",
      })
    )
  })

  it.each([
    ["la fila de la tabla", AccountsRowActions],
    ["el detalle", DetailAccountActions],
  ])("desde %s, confirma y avisa de la desactivación", async (_, Component) => {
    vi.mocked(removeAccount).mockResolvedValue(ok(null))
    renderEn(<Component account={account} />)

    fireEvent.click(screen.getByRole("button", { name: "Deactivate account" }))
    const dialog = useConfirmationDialogStore.getState().dialog!
    expect(dialog.title).toBe("Deactivate account?")
    expect(dialog.description).toBe(
      "Are you sure you want to deactivate the account Bank? This action cannot be undone."
    )
    expect(dialog.actions).toEqual({
      confirm: "Yes, deactivate account",
      cancel: "Cancel",
    })

    await dialog.onConfirm()

    expect(toast.success).toHaveBeenCalledWith("Account deactivated", {
      description: "Account Bank was deactivated successfully.",
    })
  })

  it("el detalle muestra la acción de editar traducida", () => {
    renderEn(<DetailAccountActions account={account} />)

    expect(screen.getByRole("link", { name: "Edit account" })).toBeTruthy()
  })

  it("la página de edición usa el idioma de la sesión", async () => {
    vi.mocked(findAccount).mockResolvedValue(ok({ id: "a1", name: "Bank" }))
    const params = Promise.resolve({ id: "a1" })

    renderEn(await EditAccountPage({ params }))

    expect(screen.getByText("Edit Bank")).toBeTruthy()
    expect(screen.getByText("Back to accounts")).toBeTruthy()
    expect(await generateMetadata({ params })).toEqual({ title: "Edit Bank" })
  })

  it("la página de edición traduce el título de cuenta no encontrada", async () => {
    vi.mocked(findAccount).mockResolvedValue({
      status: "error",
      errors: [],
    } as never)

    expect(
      await generateMetadata({ params: Promise.resolve({ id: "x" }) })
    ).toEqual({ title: "Account not found" })
  })
})
