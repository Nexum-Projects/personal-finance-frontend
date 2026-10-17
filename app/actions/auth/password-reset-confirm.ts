"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { z } from "zod"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"

const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, "El token es requerido"),
  newPassword: z
    .string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
})

export type PasswordResetConfirmInput = z.infer<
  typeof passwordResetConfirmSchema
>

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
    return actionError(error)
  }
}
