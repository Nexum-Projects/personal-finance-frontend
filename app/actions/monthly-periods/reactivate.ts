"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { MonthlyPeriod } from "./types"

export default async function reactivateMonthlyPeriod(
  id: string
): Promise<ActionResponse<MonthlyPeriod>> {
  try {
    const response = await baseAxios.patch<{ data: MonthlyPeriod }>(
      `/monthly-periods/${id}/reactivate`
    )

    revalidatePath("/dashboard/monthly-periods")
    revalidatePath(`/dashboard/monthly-periods/${id}`)

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
