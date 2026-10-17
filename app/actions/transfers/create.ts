"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Transfer } from "./types"
import type { TransferFormValues } from "./schema"

export default async function createTransfer(
  input: TransferFormValues
): Promise<ActionResponse<Transfer>> {
  try {
    // Convertir el monto de decimales a centavos
    const amountCents = Math.round(input.amountCents * 100)

    const response = await baseAxios.post<{ data: Transfer }>("/transfers", {
      amountCents,
      description: input.description,
      transferDate: input.transferDate,
      fromAccountId: input.fromAccountId,
      toAccountId: input.toAccountId,
    })

    revalidatePath("/dashboard/transfers")

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
