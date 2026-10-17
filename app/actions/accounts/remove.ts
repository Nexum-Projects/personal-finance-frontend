"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"

export default async function removeAccount(
  accountId: string
): Promise<ActionResponse<null>> {
  try {
    await baseAxios.delete(`/accounts/${accountId}`)

    revalidatePath("/dashboard/accounts")

    return {
      status: "success",
      data: null,
    }
  } catch (error) {
    return actionError(error)
  }
}
