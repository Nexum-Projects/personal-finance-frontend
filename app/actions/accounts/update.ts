"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Account } from "../transactions/types"
import type { AccountFormValues } from "./schema"

export default async function updateAccount(
  accountId: string,
  input: AccountFormValues
): Promise<ActionResponse<Account>> {
  try {
    const response = await baseAxios.put<{ data: Account }>(
      `/accounts/${accountId}`,
      {
        name: input.name,
        accountType: input.accountType,
      }
    )

    revalidatePath("/dashboard/accounts")
    revalidatePath(`/dashboard/accounts/${accountId}`)

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error)
  }
}
