"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { CategoryBreakdown, AnalyticsDateParams } from "./types"

export default async function getIncomeCategoryBreakdown(
  params?: AnalyticsDateParams
): Promise<ActionResponse<CategoryBreakdown[]>> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.startDate) {
      queryParams.append("startDate", params.startDate)
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate)
    }

    const url = queryParams.toString()
      ? `/transactions/analytics/categories/income?${queryParams.toString()}`
      : "/transactions/analytics/categories/income"

    const response = await baseAxios.get<{ data: CategoryBreakdown[] }>(url)

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
