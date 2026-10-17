"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { MonthlyPeriod } from "./types"
import type { MonthlyPeriodFormValues } from "./schema"

export default async function createMonthlyPeriod(
  input: MonthlyPeriodFormValues
): Promise<ActionResponse<MonthlyPeriod>> {
  try {
    // Convertir el ahorro inicial de decimales a centavos
    const initialSavingCents = Math.round(input.initialSavingCents * 100)

    const response = await baseAxios.post<{ data: MonthlyPeriod }>(
      "/monthly-periods",
      {
        year: input.year,
        month: input.month,
        initialSavingCents,
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
