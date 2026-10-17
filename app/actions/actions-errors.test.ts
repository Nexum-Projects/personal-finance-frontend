/// <reference types="vite/client" />
import { AxiosError, AxiosHeaders } from "axios"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { actionError } from "./helpers/action-error"
import { PT_MESSAGES } from "@/utils/i18n/messages"

// Sesión en portugués: los errores tienen que salir en el idioma de la sesión.
vi.mock("@/app/actions/auth/getSession", () => ({
  default: async () => ({ preferredLanguage: "PT" }),
}))
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
    set: vi.fn(),
    delete: vi.fn(),
  }),
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT")
  }),
}))

const apiError = (status: number) =>
  new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { code: "NOT_FOUND", message: "" },
  })

const NOT_FOUND_PT = {
  title: "Recurso não encontrado",
  message: "O recurso solicitado não foi encontrado.",
}

let nextError: unknown
vi.mock("@/app/actions/baseAxios", () => {
  const fail = () => Promise.reject(nextError)
  return {
    default: { get: fail, post: fail, put: fail, patch: fail, delete: fail },
  }
})

beforeEach(() => {
  nextError = apiError(404)
})

describe("actionError", () => {
  it("traduce el error del API al idioma de la sesión", async () => {
    expect(await actionError(apiError(404))).toEqual({
      status: "error",
      errors: [NOT_FOUND_PT],
    })
  })

  it("traduce un error sin respuesta del API", async () => {
    expect(await actionError(new Error("Network Error"))).toEqual({
      status: "error",
      errors: [{ title: "Erro no servidor", message: "Network Error" }],
    })
  })

  it("incluye el estado HTTP solo si se pide", async () => {
    expect(
      (await actionError(apiError(409), { withStatusCode: true })).errors[0]
    ).toMatchObject({ statusCode: 409 })
    expect((await actionError(apiError(409))).errors[0]).not.toHaveProperty(
      "statusCode"
    )
  })

  it("redirige al login con 401/403 solo si se pide", async () => {
    await expect(
      actionError(apiError(401), { redirectOnAuthError: true })
    ).rejects.toThrow("NEXT_REDIRECT")
    await expect(actionError(apiError(401))).resolves.toMatchObject({
      status: "error",
    })
  })
})

// Todas las Server Actions que llaman al API: con el API respondiendo 404, cada una devuelve
// un error con título en el idioma de la sesión (cubre sus bloques catch). Las que validan
// sus argumentos antes de llamar al API devuelven el error genérico, también traducido.
const PT_ERROR_TITLES = new Set(
  Object.entries(PT_MESSAGES)
    .filter(([key]) => /^errors\..*\.title$|^errors\.generic\.title$/.test(key))
    .map(([, value]) => value)
)
const modules = import.meta.glob<Record<string, unknown>>(
  [
    "./*/**/*.ts",
    "!./**/*.test.ts",
    "!./**/types.ts",
    "!./**/schema.ts",
    "!./**/index.ts",
    "!./helpers/**",
    "!./auth/getSession.ts",
    "!./auth/get-session-preferences.ts",
    "!./auth/logout.ts",
    "!./users/get-current-user.ts",
    "!./users/normalize-user-from-api.ts",
  ],
  { eager: true }
)
const actions = Object.entries(modules).flatMap(([file, mod]) =>
  Object.entries(mod)
    .filter(([, value]) => typeof value === "function")
    .map(([name, fn]) => [`${file} → ${name}`, fn] as const)
)

describe("Server Actions con error del API", () => {
  it("hay acciones que probar", () => {
    expect(actions.length).toBeGreaterThan(40)
  })

  it.each(actions)("%s", async (_, fn) => {
    const result = await (fn as (...args: unknown[]) => Promise<unknown>)(
      "x1",
      {},
      {}
    )

    expect(result).toMatchObject({ status: "error" })
    const [{ title }] = (result as { errors: { title: string }[] }).errors
    expect(PT_ERROR_TITLES).toContain(title)
  })
})
