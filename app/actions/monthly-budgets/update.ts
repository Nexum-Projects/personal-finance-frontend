"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { MonthlyBudget } from "./types"
import type { MonthlyBudgetFormValues } from "./schema"
import { decimalToCents } from "@/utils/helpers/format-amount"

export default async function updateMonthlyBudget(
  monthlyBudgetId: string,
  input: MonthlyBudgetFormValues
): Promise<ActionResponse<MonthlyBudget>> {
  try {
    const budgetedCents = decimalToCents(input.budgetedAmount)

    const response = await baseAxios.put<{ data: MonthlyBudget }>(
      `/monthly-budgets/${monthlyBudgetId}`,
      {
        monthlyPeriodId: input.monthlyPeriodId,
        categoryId: input.categoryId,
        budgetedCents,
      }
    )

    revalidatePath("/dashboard/monthly-periods")

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
