"use server"

import { isAxiosError } from "axios"
import { z } from "zod"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"

const passwordResetSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
})

export type PasswordResetInput = z.infer<typeof passwordResetSchema>

export default async function passwordReset(
  input: PasswordResetInput
): Promise<ActionResponse<null>> {
  try {
    const validated = passwordResetSchema.parse(input)

    await baseAxios.post("/auth/password-reset", {
      email: validated.email,
    })

    return {
      status: "success",
      data: null,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const responseData = error.response.data
      const humanizedError = parseApiError(responseData)

      return {
        status: "error",
        errors: [
          {
            title: humanizedError.title,
            message: humanizedError.description,
          },
        ],
      }
    }

    const humanizedError = parseApiError(error)
    return {
      status: "error",
      errors: [
        {
          title: humanizedError.title,
          message: humanizedError.description,
        },
      ],
    }
  }
}


