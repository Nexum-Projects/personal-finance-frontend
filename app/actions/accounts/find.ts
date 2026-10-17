"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Account } from "../transactions/types"

export default async function findAccount(
  accountId: string
): Promise<ActionResponse<Account>> {
  try {
    const response = await baseAxios.get<{ data: Account }>(
      `/accounts/${accountId}`
    )

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error)
  }
}
