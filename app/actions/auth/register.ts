"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { z } from "zod"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
import { registerSchema, type RegisterFormValues } from "./register-schema"

const RegisterResponseSchema = z.object({
  data: z.unknown().optional(),
})

export default async function registerUser(
  formValues: RegisterFormValues
): ActionResponse<{ ok: true }> {
  try {
    const payload = registerSchema.parse(formValues)

    // IMPORTANTE: no enviamos role (en backend es USER por defecto)
    await baseAxios.post("/auth/register", {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      preferredCurrency: payload.preferredCurrency,
      preferredLanguage: payload.preferredLanguage,
      timeZone: payload.timeZone,
    })

    RegisterResponseSchema.parse({ data: undefined })

    return {
      status: "success",
      data: { ok: true },
    }
  } catch (error) {
    return actionError(error)
  }
}
