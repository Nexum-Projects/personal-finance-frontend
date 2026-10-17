"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"

export default async function removeTransaction(
  transactionId: string,
  categoryType: "INCOME" | "EXPENSE"
): Promise<ActionResponse<null>> {
  try {
    await baseAxios.delete(`/transactions/${transactionId}`)

    revalidatePath(
      `/dashboard/${categoryType === "INCOME" ? "income" : "expenses"}`
    )

    return {
      status: "success",
      data: null,
    }
  } catch (error) {
    return actionError(error)
  }
}
