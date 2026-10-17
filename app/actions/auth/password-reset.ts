"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { z } from "zod"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"

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
    return actionError(error)
  }
}
