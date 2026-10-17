"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "@/app/actions/baseAxios"
import { ActionResponse } from "@/app/actions/types"
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
    return actionError(error, { redirectOnAuthError: true })
  }
}
