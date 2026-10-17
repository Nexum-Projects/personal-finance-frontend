"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"

export default async function removeMonthlyPeriod(
  id: string
): Promise<ActionResponse<void>> {
  try {
    await baseAxios.delete(`/monthly-periods/${id}`)

    revalidatePath("/dashboard/monthly-periods")

    return {
      status: "success",
      data: undefined,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
