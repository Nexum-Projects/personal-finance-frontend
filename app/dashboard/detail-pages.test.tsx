import type { ReactElement } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { findAccount } from "@/app/actions/accounts"
import { findMonthlyPeriod } from "@/app/actions/monthly-periods"
import { findTransaction } from "@/app/actions/transactions"
import { findTransfer } from "@/app/actions/transfers"
import getCurrentUser from "@/app/actions/users/get-current-user"
import AccountDetailPage from "./accounts/[id]/page"
import MonthlyPeriodDetailPage from "./monthly-periods/[id]/page"
import ProfilePage from "./profile/page"
import TransactionExpenseDetailPage, {
  generateMetadata as generateExpenseMetadata,
} from "./transactions/expenses/[id]/page"
import TransactionIncomeDetailPage from "./transactions/income/[id]/page"
import { TransactionDetail } from "./transactions/components/transaction-detail"
import TransferDetailPage from "./transfers/[id]/page"

// Sesión en inglés: sin el reloj de 24 h fijado, la hora saldría como "01:20 PM".
vi.mock("@/app/actions/auth/getSession", () => ({
  default: async () => ({
    preferredLanguage: "EN",
    timeZone: "AMERICA_GUATEMALA",
    preferredCurrency: "GTQ",
  }),
}))
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND")
  },
  usePathname: () => "/",
}))
vi.mock("@/app/actions/accounts", () => ({ findAccount: vi.fn() }))
vi.mock("@/app/actions/monthly-periods", () => ({ findMonthlyPeriod: vi.fn() }))
vi.mock("@/app/actions/transactions", () => ({ findTransaction: vi.fn() }))
vi.mock("@/app/actions/transfers", () => ({ findTransfer: vi.fn() }))
vi.mock("@/app/actions/users/get-current-user", () => ({ default: vi.fn() }))
vi.mock("./accounts/[id]/components/detail-account-actions", () => ({
  DetailAccountActions: () => null,
}))
vi.mock(
  "./monthly-periods/[id]/components/detail-monthly-period-actions",
  () => ({ DetailMonthlyPeriodActions: () => null })
)
vi.mock("./transactions/components/detail-transaction-actions", () => ({
  DetailTransactionActions: () => null,
}))
vi.mock("./transfers/[id]/components/detail-transfer-actions", () => ({
  DetailTransferActions: () => null,
}))

const CREATED = "2026-01-21T19:20:00Z" // 13:20 en America/Guatemala
const UPDATED = "2026-01-22T20:05:00Z" // 14:05
const dates = { createdAt: CREATED, updatedAt: UPDATED }
const params = Promise.resolve({ id: "x1" })

const ok = (data: unknown) => ({ status: "success", data }) as never

const transaction = {
  id: "x1",
  amountCents: 1500,
  description: "Lunch",
  transactionDate: "2026-01-21",
  category: { name: "Food", categoryType: "EXPENSE" },
  account: { name: "Wallet" },
  ...dates,
}

afterEach(cleanup)

async function renderPage(page: Promise<ReactElement>) {
  render(await page)
}

function expectDates() {
  expect(screen.getByText("01/21/2026, 13:20")).toBeTruthy()
  expect(screen.getByText("01/22/2026, 14:05")).toBeTruthy()
  expect(screen.queryByText(/PM|AM/)).toBeNull()
}

describe("fechas de creación y actualización en las páginas de detalle", () => {
  it("cuenta", async () => {
    vi.mocked(findAccount).mockResolvedValue(
      ok({
        id: "x1",
        name: "Wallet",
        accountType: "CASH",
        currentBalanceCents: 0,
        isActive: true,
        ...dates,
      })
    )
    await renderPage(AccountDetailPage({ params }))
    expectDates()
  })

  it("periodo mensual", async () => {
    vi.mocked(findMonthlyPeriod).mockResolvedValue(
      ok({ id: "x1", year: 2026, month: 1, ...dates })
    )
    await renderPage(MonthlyPeriodDetailPage({ params }))
    expectDates()
  })

  it("transferencia", async () => {
    vi.mocked(findTransfer).mockResolvedValue(
      ok({
        id: "x1",
        amountCents: 1500,
        description: "Move",
        transferDate: "2026-01-21",
        fromAccount: { name: "A" },
        toAccount: { name: "B" },
        ...dates,
      })
    )
    await renderPage(TransferDetailPage({ params }))
    expectDates()
  })

  it("perfil", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "x1",
      username: "user",
      email: "user@example.com",
      role: "USER",
      preferredCurrency: "GTQ",
      preferredLanguage: "EN",
      timeZone: "AMERICA_GUATEMALA",
      isActive: true,
      ...dates,
    } as never)
    await renderPage(ProfilePage())
    expectDates()
  })

  it.each(["EXPENSE", "INCOME"] as const)("transacción %s", async (type) => {
    vi.mocked(findTransaction).mockResolvedValue(ok(transaction))
    await renderPage(TransactionDetail({ id: "x1", categoryType: type }))
    expectDates()
  })
})

describe("detalle de transacción compartido", () => {
  it("las páginas de gasto e ingreso delegan con su tipo", async () => {
    const expense = await TransactionExpenseDetailPage({ params })
    const income = await TransactionIncomeDetailPage({ params })

    expect(expense.props).toEqual({ id: "x1", categoryType: "EXPENSE" })
    expect(income.props).toEqual({ id: "x1", categoryType: "INCOME" })
  })

  it("responde 404 si la transacción no existe", async () => {
    vi.mocked(findTransaction).mockResolvedValue({ status: "error" } as never)
    await expect(
      TransactionDetail({ id: "x1", categoryType: "EXPENSE" })
    ).rejects.toThrow("NEXT_NOT_FOUND")
  })

  it("usa la descripción como título y avisa si no existe", async () => {
    vi.mocked(findTransaction).mockResolvedValue(ok(transaction))
    expect(await generateExpenseMetadata({ params })).toEqual({
      title: "Lunch",
    })

    vi.mocked(findTransaction).mockResolvedValue({ status: "error" } as never)
    expect((await generateExpenseMetadata({ params })).title).toBeTruthy()
  })
})
