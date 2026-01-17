'use server'

import { isAxiosError } from "axios"
import { z } from "zod"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"

type Props = {
  token: string
}

const ConfirmEmailResponseSchema = z.object({
  data: z.unknown().optional(),
})

export default async function confirmEmail({ token }: Props): ActionResponse<{ ok: true }> {
  try {
    await baseAxios.post("/auth/confirm-email", { token })

    // Si el backend retorna algo consistente, se puede parsear aquí.
    // Por ahora, tratamos cualquier 2xx como éxito.
    ConfirmEmailResponseSchema.parse({ data: undefined })

    return {
      status: "success",
      data: { ok: true },
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const humanizedError = parseApiError(error.response.data)
      return {
        status: "error",
        errors: [{ title: humanizedError.title, message: humanizedError.description }],
      }
    }

    const humanizedError = parseApiError(error)
    return {
      status: "error",
      errors: [{ title: humanizedError.title, message: humanizedError.description }],
    }
  }
}

