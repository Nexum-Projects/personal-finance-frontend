"use server"

import { revalidatePath } from "next/cache"
import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthErrorServer } from "../helpers/handle-auth-error-server"
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

