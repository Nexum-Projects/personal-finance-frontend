"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type {
  MonthlyBudgetPageResponse,
  MonthlyBudgetSearchParams,
} from "./types"

export default async function findManyMonthlyBudgets(
  params?: MonthlyBudgetSearchParams
): Promise<ActionResponse<MonthlyBudgetPageResponse>> {
  try {
    // Construir query params
    const queryParams = new URLSearchParams()

    if (params?.page) {
      queryParams.append("page", params.page.toString())
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString())
    }
    if (params?.order) {
      queryParams.append("order", params.order)
    }
    if (params?.orderBy) {
      queryParams.append("orderBy", params.orderBy)
    }
    if (params?.search) {
      queryParams.append("search", params.search)
    }
    if (params?.monthlyPeriodId) {
      queryParams.append("monthlyPeriodId", params.monthlyPeriodId)
    }
    if (params?.pagination !== undefined) {
      queryParams.append("pagination", params.pagination.toString())
    }

    const url = queryParams.toString()
      ? `/monthly-budgets?${queryParams.toString()}`
      : "/monthly-budgets"

    const response = await baseAxios.get<MonthlyBudgetPageResponse>(url)

    return {
      status: "success",
      data: response.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
