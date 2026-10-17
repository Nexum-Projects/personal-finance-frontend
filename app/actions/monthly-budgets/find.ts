"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { MonthlyBudget } from "./types"

export default async function findMonthlyBudget(
  id: string
): Promise<ActionResponse<MonthlyBudget>> {
  try {
    const response = await baseAxios.get<{ data: MonthlyBudget }>(
      `/monthly-budgets/${id}`
    )

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
