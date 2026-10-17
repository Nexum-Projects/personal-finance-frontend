"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { z } from "zod"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"

const schema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
})

type Props = z.infer<typeof schema>

export default async function confirmEmailRequest({
  email,
}: Props): ActionResponse<{ ok: true }> {
  try {
    const payload = schema.parse({ email })

    await baseAxios.post("/auth/confirm-email/request", payload)

    return {
      status: "success",
      data: { ok: true },
    }
  } catch (error) {
    return actionError(error)
  }
}
