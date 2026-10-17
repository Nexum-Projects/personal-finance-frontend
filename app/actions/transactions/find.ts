"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Transaction } from "./types"

export default async function findTransaction(
  transactionId: string
): Promise<ActionResponse<Transaction>> {
  try {
    const response = await baseAxios.get<{ data: Transaction }>(
      `/transactions/${transactionId}`
    )

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error)
  }
}
