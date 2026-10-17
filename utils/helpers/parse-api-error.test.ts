import { afterEach, describe, expect, it, vi } from "vitest"
import { humanizeError } from "./humanize-error"
import { parseApiError } from "./parse-api-error"
import { parseSessionApiError } from "@/app/actions/helpers/parse-session-api-error"
import { EN_MESSAGES, ES_MESSAGES, PT_MESSAGES } from "@/utils/i18n/messages"

vi.mock("@/app/actions/auth/get-session-preferences", () => ({
  default: async () => ({ preferredLanguage: "PT" }),
}))

describe("humanizeError", () => {
  it("traduce el código al idioma indicado", () => {
    expect(
      humanizeError("UNAUTHORIZED/TOKEN_EXPIRED", undefined, undefined, "EN")
    ).toEqual({
      title: "Token expired",
      description: "Your session has expired. Please sign in again.",
    })
  })

  it("sin idioma sigue en español", () => {
    expect(humanizeError("UNAUTHORIZED/TOKEN_EXPIRED").title).toBe(
      "Token expirado"
    )
  })

  it("usa el mensaje del servidor como descripción, con el título traducido", () => {
    expect(
      humanizeError("NOT_FOUND", "Account x1 not found", undefined, "PT")
    ).toEqual({
      title: "Recurso não encontrado",
      description: "Account x1 not found",
    })
  })

  it("traduce los nombres de campo de los errores de validación", () => {
    const result = humanizeError(
      "BAD_REQUEST/VALIDATION_ERROR",
      "Validation failed",
      {
        fieldErrors: { amountCents: "must be positive", dueDay: "is required" },
      },
      "EN"
    )
    expect(result).toEqual({
      title: "Validation error",
      description: "Amount: must be positive. Due Day: is required",
    })
  })

  it("detalla saldo e importe en fondos insuficientes", () => {
    const result = humanizeError(
      "BAD_REQUEST/INSUFFICIENT_FUNDS",
      "Insufficient funds",
      { amountCents: 5000, currentBalanceCents: 1000 },
      "EN"
    )
    expect(result.title).toBe("Insufficient funds")
    expect(result.description).toMatch(
      /^You do not have enough balance in the account\. Available balance: .*10\.00\. Transaction\/transfer amount: .*50\.00\.$/
    )
  })

  it("traduce la cuenta no verificada", () => {
    expect(
      humanizeError(
        "BAD_REQUEST",
        "User account is not verified",
        undefined,
        "EN"
      ).title
    ).toBe("Account not verified")
  })

  it("código desconocido: título genérico y mensaje del servidor o genérico", () => {
    expect(humanizeError("TEAPOT", "I'm a teapot", undefined, "EN")).toEqual({
      title: "Error",
      description: "I'm a teapot",
    })
    expect(
      humanizeError("TEAPOT", undefined, undefined, "PT").description
    ).toBe(PT_MESSAGES["errors.unknown.desc"])
  })
})

describe("parseApiError", () => {
  it("respeta el título de un error que ya humanizó una Server Action", () => {
    // Antes se re-humanizaba como INTERNAL_SERVER_ERROR y el título pasaba a "Error en el servidor".
    expect(
      parseApiError(
        { title: "Insufficient funds", message: "Not enough balance" },
        "ES"
      )
    ).toEqual({
      title: "Insufficient funds",
      description: "Not enough balance",
    })
  })

  it("traduce un ErrorDTO del API", () => {
    expect(parseApiError({ code: "FORBIDDEN", message: "" }, "EN").title).toBe(
      "Access denied"
    )
  })

  it("traduce el título de un texto suelto", () => {
    expect(parseApiError("Algo falló", "PT")).toEqual({
      title: "Erro",
      description: "Algo falló",
    })
  })

  it("traduce un Error de JavaScript (p. ej. de red)", () => {
    expect(parseApiError(new Error("Network Error"), "EN")).toEqual({
      title: "Server error",
      description: "Network Error",
    })
  })

  it("traduce el error desconocido", () => {
    expect(parseApiError(undefined, "EN")).toEqual({
      title: "Unknown error",
      description: "An unexpected error occurred. Please try again.",
    })
  })
})

describe("parseApiError sin idioma explícito", () => {
  afterEach(() => {
    document.documentElement.lang = ""
  })

  it("usa el idioma de la página (<html lang>)", () => {
    document.documentElement.lang = "en"
    expect(parseApiError(undefined).title).toBe("Unknown error")
  })

  it("con un idioma de página no soportado, usa español", () => {
    document.documentElement.lang = "fr"
    expect(parseApiError(undefined).title).toBe("Error desconocido")
  })
})

describe("parseSessionApiError", () => {
  it("usa el idioma de la sesión", async () => {
    expect(
      (await parseSessionApiError({ code: "NOT_FOUND", message: "" })).title
    ).toBe("Recurso não encontrado")
  })
})

describe("diccionario de errores", () => {
  it("ES, EN y PT tienen las mismas claves de error", () => {
    const keys = (m: Record<string, string>) =>
      Object.keys(m)
        .filter((k) => k.startsWith("errors."))
        .sort()
    expect(keys(EN_MESSAGES)).toEqual(keys(ES_MESSAGES))
    expect(keys(PT_MESSAGES)).toEqual(keys(ES_MESSAGES))
  })
})
