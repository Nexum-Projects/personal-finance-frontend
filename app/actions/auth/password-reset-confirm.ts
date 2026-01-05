"use server"

import { isAxiosError } from "axios"
import { z } from "zod"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"

const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, "El token es requerido"),
  newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
})

export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>

export default async function passwordResetConfirm(
  input: PasswordResetConfirmInput
): Promise<ActionResponse<null>> {
  try {
    const validated = passwordResetConfirmSchema.parse(input)

    await baseAxios.post("/auth/password-reset/confirm", {
      token: validated.token,
      newPassword: validated.newPassword,
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


