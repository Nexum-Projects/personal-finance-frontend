"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"

export default async function removeTransfer(
  id: string
): Promise<ActionResponse<void>> {
  try {
    await baseAxios.delete(`/transfers/${id}`)

    revalidatePath("/dashboard/transfers")

    return {
      status: "success",
      data: undefined,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
