"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Transaction } from "./types"
import type { TransactionFormValues } from "./schema"

export default async function createTransaction(
  input: TransactionFormValues,
  categoryType: "INCOME" | "EXPENSE"
): Promise<ActionResponse<Transaction>> {
  try {
    // Convertir el monto de decimales a centavos
    const amountCents = Math.round(input.amount * 100)

    const response = await baseAxios.post<{ data: Transaction }>(
      "/transactions",
      {
        amountCents,
        description: input.description,
        categoryId: input.categoryId,
        accountId: input.accountId,
        transactionDate: input.transactionDate,
      }
    )

    revalidatePath(
      `/dashboard/${categoryType === "INCOME" ? "income" : "expenses"}`
    )

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error)
  }
}
