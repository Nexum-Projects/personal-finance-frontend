"use server"

import { revalidatePath } from "next/cache"
import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import type { Account } from "../transactions/types"
import type { AccountFormValues } from "./schema"

export default async function createAccount(
  input: AccountFormValues
): Promise<ActionResponse<Account>> {
  try {
    // Convertir el balance inicial a centavos
    // Si es undefined o null, usar 0
    const initialBalance = input.initialBalance ?? 0
    const initialBalanceCents = Math.round(initialBalance * 100)

    const response = await baseAxios.post<{ data: Account }>("/accounts", {
      name: input.name,
      accountType: input.accountType,
      initialBalanceCents,
    })

    revalidatePath("/dashboard/accounts")

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
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


