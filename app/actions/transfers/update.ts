"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Transfer } from "./types"
import type { TransferUpdateFormValues } from "./schema"

export default async function updateTransfer(
  transferId: string,
  input: TransferUpdateFormValues
): Promise<ActionResponse<Transfer>> {
  try {
    const payload: {
      amountCents?: number
      description?: string
    } = {}

    if (input.amountCents !== undefined) {
      payload.amountCents = Math.round(input.amountCents * 100)
    }
    if (input.description !== undefined) {
      payload.description = input.description
    }

    const response = await baseAxios.put<{ data: Transfer }>(
      `/transfers/${transferId}`,
      payload
    )

    revalidatePath("/dashboard/transfers")
    revalidatePath(`/dashboard/transfers/${transferId}`)

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
