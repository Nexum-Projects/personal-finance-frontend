"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "@/app/actions/baseAxios"
import { ActionResponse } from "@/app/actions/types"
import type { MonthlyBudgetAnalyticsByPeriodResponse } from "./types"

export default async function getMonthlyBudgetsAnalyticsByMonthlyPeriod(
  monthlyPeriodId: string
): Promise<ActionResponse<MonthlyBudgetAnalyticsByPeriodResponse>> {
  try {
    const response =
      await baseAxios.get<MonthlyBudgetAnalyticsByPeriodResponse>(
        `/monthly-budgets/analytics/monthly-period/${monthlyPeriodId}`
      )

    return {
      status: "success",
      data: response.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
