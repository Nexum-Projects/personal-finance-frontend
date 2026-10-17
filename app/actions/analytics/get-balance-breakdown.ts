"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { AccountBalanceBreakdown } from "./types"

export default async function getAccountBalanceBreakdown(): Promise<
  ActionResponse<AccountBalanceBreakdown[]>
> {
  try {
    const response = await baseAxios.get<{ data: AccountBalanceBreakdown[] }>(
      "/accounts/analytics/balance-breakdown"
    )

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
