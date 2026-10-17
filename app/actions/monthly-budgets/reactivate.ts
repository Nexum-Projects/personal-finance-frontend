"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { MonthlyBudget } from "./types"

export default async function reactivateMonthlyBudget(
  id: string,
  monthlyPeriodId?: string
): Promise<ActionResponse<MonthlyBudget>> {
  try {
    const response = await baseAxios.patch<{ data: MonthlyBudget }>(
      `/monthly-budgets/${id}/reactivate`
    )

    revalidatePath("/dashboard/monthly-periods")
    if (monthlyPeriodId) {
      revalidatePath(`/dashboard/monthly-periods/${monthlyPeriodId}/budgets`)
    }

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
