"use server"

import { revalidatePath } from "next/cache"
import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
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

    revalidatePath(`/dashboard/${categoryType === "INCOME" ? "income" : "expenses"}`)

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const responseData = error.response.data
      //console.log(JSON.stringify(responseData, null, 2))
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

