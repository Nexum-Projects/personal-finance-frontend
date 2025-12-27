"use server"

import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import type {
  TransactionPageResponse,
  TransactionSearchParams,
} from "./types"

export default async function findManyTransactions(
  params: TransactionSearchParams
): Promise<ActionResponse<TransactionPageResponse>> {
  try {
    // Construir query params
    const queryParams = new URLSearchParams()

    if (params.page) {
      queryParams.append("page", params.page.toString())
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString())
    }
    if (params.order) {
      queryParams.append("order", params.order)
    }
    if (params.orderBy) {
      queryParams.append("orderBy", params.orderBy)
    }
    if (params.search) {
      queryParams.append("search", params.search)
    }
    if (params.categoryType) {
      queryParams.append("categoryType", params.categoryType)
    }
    if (params.pagination !== undefined) {
      queryParams.append("pagination", params.pagination.toString())
    }

    const response = await baseAxios.get<TransactionPageResponse>(
      `/transactions?${queryParams.toString()}`
    )

    return {
      status: "success",
      data: response.data,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
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

