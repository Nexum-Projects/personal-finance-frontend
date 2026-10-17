"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { z } from "zod"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"

type Props = {
  token: string
}

const ConfirmEmailResponseSchema = z.object({
  data: z.unknown().optional(),
})

export default async function confirmEmail({
  token,
}: Props): ActionResponse<{ ok: true }> {
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
    return actionError(error)
  }
}
