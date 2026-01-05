"use server"

import { isAxiosError } from "axios"
import baseAxios from "@/app/actions/baseAxios"
import { ActionResponse } from "@/app/actions/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthErrorServer } from "@/app/actions/helpers/handle-auth-error-server"
import type { MonthlyBudgetAnalyticsByPeriodResponse } from "./types"

export default async function getMonthlyBudgetsAnalyticsByMonthlyPeriod(
  monthlyPeriodId: string
): Promise<ActionResponse<MonthlyBudgetAnalyticsByPeriodResponse>> {
  try {
    const response = await baseAxios.get<MonthlyBudgetAnalyticsByPeriodResponse>(
      `/monthly-budgets/analytics/monthly-period/${monthlyPeriodId}`
    )

    return {
      status: "success",
      data: response.data,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status

      if (status === 401 || status === 403) {
        await handleAuthErrorServer()
      }

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


