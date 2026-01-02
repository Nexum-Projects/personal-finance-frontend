"use server"

import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthErrorServer } from "../helpers/handle-auth-error-server"
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

