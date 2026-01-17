'use server'

import { isAxiosError } from "axios"
import { z } from "zod"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"

const schema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
})

type Props = z.infer<typeof schema>

export default async function confirmEmailRequest({ email }: Props): ActionResponse<{ ok: true }> {
  try {
    const payload = schema.parse({ email })

    await baseAxios.post("/auth/confirm-email/request", payload)

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

