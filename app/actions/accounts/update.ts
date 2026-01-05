"use server"

import { revalidatePath } from "next/cache"
import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import type { Account } from "../transactions/types"
import type { AccountFormValues } from "./schema"

export default async function updateAccount(
  accountId: string,
  input: AccountFormValues
): Promise<ActionResponse<Account>> {
  try {
    const response = await baseAxios.put<{ data: Account }>(`/accounts/${accountId}`, {
      name: input.name,
      accountType: input.accountType,
    })

    revalidatePath("/dashboard/accounts")
    revalidatePath(`/dashboard/accounts/${accountId}`)

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


