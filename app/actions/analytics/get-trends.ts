"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { TrendData, AnalyticsParams } from "./types"

export default async function getTrends(
  params?: AnalyticsParams
): Promise<ActionResponse<TrendData[]>> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.startDate) {
      queryParams.append("startDate", params.startDate)
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate)
    }
    if (params?.groupBy) {
      queryParams.append("groupBy", params.groupBy)
    }

    const url = queryParams.toString()
      ? `/transactions/analytics/trends?${queryParams.toString()}`
      : "/transactions/analytics/trends"

    const response = await baseAxios.get<{ data: TrendData[] }>(url)

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
