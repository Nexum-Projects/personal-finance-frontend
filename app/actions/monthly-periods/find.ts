"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { MonthlyPeriod } from "./types"

export default async function findMonthlyPeriod(
  id: string
): Promise<ActionResponse<MonthlyPeriod>> {
  try {
    const response = await baseAxios.get<{ data: MonthlyPeriod }>(
      `/monthly-periods/${id}`
    )

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
