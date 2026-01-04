"use server"

import { revalidatePath } from "next/cache"
import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthErrorServer } from "../helpers/handle-auth-error-server"
import type { MonthlyPeriod } from "./types"
import type { MonthlyPeriodUpdateFormValues } from "./schema"

export default async function updateMonthlyPeriod(
  monthlyPeriodId: string,
  input: MonthlyPeriodUpdateFormValues
): Promise<ActionResponse<MonthlyPeriod>> {
  try {
    const response = await baseAxios.put<{ data: MonthlyPeriod }>(
      `/monthly-periods/${monthlyPeriodId}`,
      {
        initialSavingCents: input.initialSavingCents,
      }
    )

    revalidatePath("/dashboard/monthly-periods")
    revalidatePath(`/dashboard/monthly-periods/${monthlyPeriodId}`)

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

