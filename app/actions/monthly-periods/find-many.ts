"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type {
  MonthlyPeriodPageResponse,
  MonthlyPeriodSearchParams,
} from "./types"

export default async function findManyMonthlyPeriods(
  params?: MonthlyPeriodSearchParams
): Promise<ActionResponse<MonthlyPeriodPageResponse>> {
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
    if (params?.startDate) {
      queryParams.append("startDate", params.startDate)
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate)
    }
    if (params?.pagination !== undefined) {
      queryParams.append("pagination", params.pagination.toString())
    }

    const url = queryParams.toString()
      ? `/monthly-periods?${queryParams.toString()}`
      : "/monthly-periods"

    const response = await baseAxios.get<MonthlyPeriodPageResponse>(url)

    return {
      status: "success",
      data: response.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
