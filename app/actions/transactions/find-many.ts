"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { TransactionPageResponse, TransactionSearchParams } from "./types"

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
    if (params.startDate) {
      queryParams.append("startDate", params.startDate)
    }
    if (params.endDate) {
      queryParams.append("endDate", params.endDate)
    }
    if (params.categoryId) {
      queryParams.append("categoryId", params.categoryId)
    }
    if (params.accountId) {
      queryParams.append("accountId", params.accountId)
    }

    const response = await baseAxios.get<TransactionPageResponse>(
      `/transactions?${queryParams.toString()}`
    )

    return {
      status: "success",
      data: response.data,
    }
  } catch (error) {
    return actionError(error)
  }
}
