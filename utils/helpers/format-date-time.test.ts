import { describe, expect, it } from "vitest"
import { formatDateTime } from "./format-date-time"

describe("formatDateTime", () => {
  it("usa reloj de 24 h en la zona horaria indicada", () => {
    expect(
      formatDateTime("2026-01-21T19:20:00Z", "es-GT", "America/Guatemala")
    ).toBe("21/01/2026, 13:20")
  })

  it("no produce 24:xx a medianoche", () => {
    expect(formatDateTime("2026-01-21T00:05:00Z", "es-GT", "UTC")).toBe(
      "21/01/2026, 00:05"
    )
  })

  it("devuelve el texto original si la zona horaria no es válida", () => {
    expect(formatDateTime("2026-01-21T19:20:00Z", "es-GT", "Nope/Nope")).toBe(
      "2026-01-21T19:20:00Z"
    )
  })
})
