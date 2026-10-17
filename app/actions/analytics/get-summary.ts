"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { AnalyticsSummary, AnalyticsDateParams } from "./types"

export default async function getAnalyticsSummary(
  params?: AnalyticsDateParams
): Promise<ActionResponse<AnalyticsSummary>> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.startDate) {
      queryParams.append("startDate", params.startDate)
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate)
    }

    const url = queryParams.toString()
      ? `/transactions/analytics/summary?${queryParams.toString()}`
      : "/transactions/analytics/summary"

    const response = await baseAxios.get<{ data: AnalyticsSummary }>(url)

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
