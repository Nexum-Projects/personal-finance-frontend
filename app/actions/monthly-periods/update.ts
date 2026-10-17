"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
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
    return actionError(error, { redirectOnAuthError: true })
  }
}
