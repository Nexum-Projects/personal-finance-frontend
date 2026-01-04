"use server"

import { isAxiosError } from "axios"
import baseAxios from "@/app/actions/baseAxios"
import { ActionResponse } from "@/app/actions/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthErrorServer } from "@/app/actions/helpers/handle-auth-error-server"
import type { MonthlyPeriodAnalyticsResponse } from "./types"

type GetMonthlyPeriodsAnalyticsParams = {
  year?: number
  order?: "ASC" | "DESC"
}

export default async function getMonthlyPeriodsAnalytics(
  params?: GetMonthlyPeriodsAnalyticsParams
): Promise<ActionResponse<MonthlyPeriodAnalyticsResponse>> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.year) {
      queryParams.append("year", params.year.toString())
    }
    if (params?.order) {
      queryParams.append("order", params.order)
    }

    const url = queryParams.toString()
      ? `/monthly-periods/analytics?${queryParams.toString()}`
      : "/monthly-periods/analytics"

    const response = await baseAxios.get<MonthlyPeriodAnalyticsResponse>(url)

    return {
      status: "success",
      data: {
        data: response.data.data,
      },
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status

      // Manejar errores de autenticación
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

